-- State-machine POC for the simulator.
-- With HMI Modbus enabled, this keeps running and repeats cycles until the
-- requested batch target is reached.

current_state = S00_INIT
fault_code = FAULT_NONE
cycle_counter = 0
program_done = 0
stop_after_cycle_requested = 0

function hmi_emergency_stop_requested()
    return HMI_MODBUS_ENABLED == 1 and hmi_estop_requested()
end

function request_safety_stop(code)
    fault_code = code
    current_state = S990_SAFETY_STOP
    all_outputs_off()
    return false
end

function guard_cycle_control()
    if hmi_emergency_stop_requested() then
        return request_safety_stop(F991_HMI_ESTOP)
    end

    if current_state ~= S990_SAFETY_STOP and sim_input("safety_ok") == false then
        return request_safety_stop(F990_SAFETY_STOP)
    end

    if hmi_stop_requested() then
        stop_after_cycle_requested = 1
    end

    return true
end

function wait_sim_input(name, timeout_ms)
    local elapsed = 0
    while elapsed < timeout_ms do
        if guard_cycle_control() == false then
            return false
        end

        if sim_input(name) then
            return true
        end

        WaitMs(INPUT_POLL_MS)
        elapsed = elapsed + INPUT_POLL_MS
    end
    return false
end

function raise_fault(code)
    fault_code = code
    current_state = S900_FAULT
end

function state_init()
    local release_filter_at_home = gripper_is_commanded_closed()
    all_outputs_off_except_gripper()
    if release_filter_at_home then
        set_output(DO_GRIPPER_CLOSE, true)
    else
        set_output(DO_GRIPPER_CLOSE, false)
    end
    fault_code = FAULT_NONE
    filter_dispenser_reset()
    if move_home() == false then return end
    if release_filter_at_home then
        set_output(DO_GRIPPER_CLOSE, false)
        if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return end
    end
    current_state = S20_WAIT_READY
end

function state_wait_ready()
    if sim_input("safety_ok") then
        current_state = S30_WAIT_START
    else
        current_state = S990_SAFETY_STOP
    end
end

function state_wait_start()
    set_ready_lamps()
    if hmi_start_requested() then
        stop_after_cycle_requested = 0
        current_state = S40_SELECT_FILTER_DISPENSER
    else
        if HMI_MODBUS_ENABLED ~= 1 then
            program_done = 1
        end
    end
end

function state_select_filter_dispenser()
    set_running_lamps()

    if filter_dispenser_select() then
        current_state = S50_DISPENSE_FILTER
    else
        raise_fault(F001_FILTER_NOT_AVAILABLE)
    end
end

function state_dispense_filter()
    if filter_dispenser_prepare_pick() then
        current_state = S60_PICK_FILTER
    elseif current_state == S50_DISPENSE_FILTER then
        raise_fault(F001_FILTER_NOT_AVAILABLE)
    end
end

function state_pick_filter()
    set_running_lamps()

    if wait_sim_input("filter_present", PICK_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return
    end

    if pick_filter_motion() == false then return end

    if wait_sim_input("gripper_filter_present", GRIPPER_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return
    end

    set_output(DO_DEBUG_PICK_OK, true)
    current_state = S70_PLACE_FILTER_IN_CLAMP
end

function state_place_filter_in_clamp()
    set_output(DO_DEBUG_PLACE_ENTERED, true)
    if place_filter_in_clamp_motion() == false then return end
    current_state = S80_CLAMP_FILTER
end

function state_clamp_filter()
    if clamp_close_and_verify() then
        current_state = S90_DISPENSE_CHECK_VALVE
    end
end

function state_dispense_check_valve()
    if check_valve_dispenser_prepare_pick() then
        current_state = S100_PICK_CHECK_VALVE
    else
        raise_fault(F010_CHECK_VALVE_NOT_AVAILABLE)
    end
end

function state_pick_check_valve()
    set_running_lamps()
    if pick_check_valve_motion() == false then
        set_output(DO_CHECK_VALVE_FEED, false)
        return
    end
    set_output(DO_CHECK_VALVE_FEED, false)
    if align_check_valve_on_table_motion() == false then return end
    current_state = S110_APPLY_GLUE
end

function state_apply_glue()
    set_running_lamps()
    if glue_apply() == false then return end
    current_state = S120_INSERT_CHECK_VALVE
end

function state_insert_check_valve()
    if insert_check_valve_motion() == false then return end
    current_state = S130_PRESS_CHECK_VALVE
end

function state_press_check_valve()
    if press_check_valve_and_verify() then
        current_state = S140_UNCLAMP_FILTER
    end
end

function state_unclamp_filter()
    if clamp_open_and_verify() then
        current_state = S150_PICK_FINISHED_FILTER
    end
end

function state_pick_finished_filter()
    set_running_lamps()
    if pick_finished_filter_motion() == false then return end
    current_state = S160_PLACE_IN_DRYING_ROW
end

function state_place_in_drying_row()
    if place_in_drying_row_motion() == false then return end
    current_state = S170_INDEX_DRYING_ROW
end

function state_index_drying_row()
    if index_drying_row_motion() == false then return end
    current_state = S180_CYCLE_COMPLETE
end

function state_cycle_complete()
    cycle_counter = cycle_counter + 1
    current_state = S190_CHECK_NEXT_CYCLE
end

function state_check_next_cycle()
    all_outputs_off()

    if HMI_MODBUS_ENABLED == 1 then
        if stop_after_cycle_requested == 1 then
            stop_after_cycle_requested = 0
            set_ready_lamps()
            current_state = S30_WAIT_START
        elseif cycle_counter < hmi_read_batch_target() then
            set_running_lamps()
            current_state = S40_SELECT_FILTER_DISPENSER
        else
            if move_home() == false then return end
            set_ready_lamps()
            current_state = S850_BATCH_COMPLETE
        end
        return
    end

    move_home()
    set_ready_lamps()
    program_done = 1
end

function state_batch_complete()
    all_outputs_off()
    set_ready_lamps()

    if hmi_reset_requested() then
        cycle_counter = 0
        stop_after_cycle_requested = 0
        current_state = S00_INIT
        return
    end

    if hmi_start_requested() and cycle_counter < hmi_read_batch_target() then
        stop_after_cycle_requested = 0
        current_state = S40_SELECT_FILTER_DISPENSER
    end
end

function state_fault()
    all_outputs_off_except_gripper()
    set_fault_lamps()
    if HMI_MODBUS_ENABLED == 1 then
        current_state = S910_WAIT_RESET
        return
    end
    program_done = 1
end

function state_wait_reset()
    all_outputs_off_except_gripper()
    set_fault_lamps()
    if hmi_reset_requested() and sim_input("safety_ok") then
        stop_after_cycle_requested = 0
        current_state = S00_INIT
    end
end

function state_safety_stop()
    all_outputs_off()
    set_fault_lamps()
    if HMI_MODBUS_ENABLED == 1 then
        if sim_input("safety_ok") and hmi_reset_requested() then
            stop_after_cycle_requested = 0
            current_state = S00_INIT
        end
        return
    end
    program_done = 1
end

while program_done == 0 do
    guard_cycle_control()

    if current_state == S00_INIT then
        state_init()
    elseif current_state == S20_WAIT_READY then
        state_wait_ready()
    elseif current_state == S30_WAIT_START then
        state_wait_start()
    elseif current_state == S40_SELECT_FILTER_DISPENSER then
        state_select_filter_dispenser()
    elseif current_state == S50_DISPENSE_FILTER then
        state_dispense_filter()
    elseif current_state == S60_PICK_FILTER then
        state_pick_filter()
    elseif current_state == S70_PLACE_FILTER_IN_CLAMP then
        state_place_filter_in_clamp()
    elseif current_state == S80_CLAMP_FILTER then
        state_clamp_filter()
    elseif current_state == S90_DISPENSE_CHECK_VALVE then
        state_dispense_check_valve()
    elseif current_state == S100_PICK_CHECK_VALVE then
        state_pick_check_valve()
    elseif current_state == S110_APPLY_GLUE then
        state_apply_glue()
    elseif current_state == S120_INSERT_CHECK_VALVE then
        state_insert_check_valve()
    elseif current_state == S130_PRESS_CHECK_VALVE then
        state_press_check_valve()
    elseif current_state == S140_UNCLAMP_FILTER then
        state_unclamp_filter()
    elseif current_state == S150_PICK_FINISHED_FILTER then
        state_pick_finished_filter()
    elseif current_state == S160_PLACE_IN_DRYING_ROW then
        state_place_in_drying_row()
    elseif current_state == S170_INDEX_DRYING_ROW then
        state_index_drying_row()
    elseif current_state == S180_CYCLE_COMPLETE then
        state_cycle_complete()
    elseif current_state == S190_CHECK_NEXT_CYCLE then
        state_check_next_cycle()
    elseif current_state == S850_BATCH_COMPLETE then
        state_batch_complete()
    elseif current_state == S900_FAULT then
        state_fault()
    elseif current_state == S910_WAIT_RESET then
        state_wait_reset()
    elseif current_state == S990_SAFETY_STOP then
        state_safety_stop()
    else
        raise_fault(999)
    end

    hmi_publish_status()
    WaitMs(INPUT_POLL_MS)
end
