-- Robot movement routines for the filter/keerklep demo cell.
-- A010 series points are simulator/demo points now and become real taught points later.

function motion_guard()
    if guard_cycle_control == nil then
        return true
    end
    return guard_cycle_control()
end

function guarded_wait(ms)
    local elapsed = 0
    while elapsed < ms do
        if motion_guard() == false then
            return false
        end
        WaitMs(INPUT_POLL_MS)
        elapsed = elapsed + INPUT_POLL_MS
    end
    return true
end

function move_home()
    if motion_guard() == false then return false end
    PTP(A010_HOME, SPEED_HOME, -1, 0)
    return motion_guard()
end

function pick_filter_motion()
    if motion_guard() == false then return false end
    PTP(A020_FILTER_PICK_APPROACH, SPEED_APPROACH, -1, 0)
    if motion_guard() == false then return false end
    Lin(A030_FILTER_PICK, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, true)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    Lin(A040_FILTER_LIFT, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    return true
end

function place_filter_in_clamp_motion()
    if motion_guard() == false then return false end
    PTP(A050_CLAMP_APPROACH, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    Lin(A060_FILTER_PLACE_IN_CLAMP, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, false)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    Lin(A070_CLAMP_RETRACT, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    return true
end

function place_filter_motion()
    place_filter_in_clamp_motion()
end

function pick_check_valve_motion()
    if motion_guard() == false then return false end
    PTP(A080_VALVE_PICK_APPROACH, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    Lin(A090_VALVE_PICK, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, true)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    Lin(A100_VALVE_LIFT, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    return true
end

function pick_valve_motion()
    pick_check_valve_motion()
end

function align_check_valve_on_table_motion()
    if motion_guard() == false then return false end
    PTP(A102_CHECK_VALVE_ALIGN_APPROACH, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    Lin(A104_CHECK_VALVE_ALIGN_PLACE, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, false)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    Lin(A106_CHECK_VALVE_ALIGN_REGRIP, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, true)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    PTP(A108_CHECK_VALVE_ALIGN_RETRACT, SPEED_RETRACT, -1, 0)
    if motion_guard() == false then return false end
    return true
end

function insert_check_valve_motion()
    if motion_guard() == false then return false end
    PTP(A140_VALVE_INSERT_APPROACH, SPEED_APPROACH, -1, 0)
    if motion_guard() == false then return false end
    Lin(A150_VALVE_INSERT, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, false)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then return false end
    Lin(A160_VALVE_INSERT_RETRACT, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    return true
end

function place_valve_motion()
    insert_check_valve_motion()
end

function pick_finished_filter_motion()
    if motion_guard() == false then return false end
    PTP(A170_FINISHED_PICK_APPROACH, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    Lin(A180_FINISHED_PICK, SPEED_PICK_PLACE, -1, 0, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, true)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    Lin(A185_FINISHED_PULLBACK, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    Lin(A190_FINISHED_LIFT, SPEED_RETRACT, -1, 0, 0)
    if motion_guard() == false then return false end
    return true
end

function place_in_drying_row_motion()
    if motion_guard() == false then return false end
    PTP(A195_ROW_PLACE_PULLBACK, SPEED_RETRACT, -1, 0)
    if motion_guard() == false then return false end
    PTP(A200_DRYING_ROW_APPROACH, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    PTP(A210_DRYING_ROW_PLACE, SPEED_PICK_PLACE, -1, 0)
    if motion_guard() == false then return false end
    set_output(DO_GRIPPER_CLOSE, false)
    if guarded_wait(GRIPPER_CLOSE_TIME_MS) == false then return false end
    PTP(A220_DRYING_ROW_RETRACT, SPEED_RETRACT, -1, 0)
    if motion_guard() == false then return false end
    return true
end

function index_drying_row_motion()
    if motion_guard() == false then return false end
    PTP(A230_DRYING_ROW_INDEX_START, SPEED_DRYING_INDEX, -1, 0)
    if motion_guard() == false then return false end
    PTP(A240_DRYING_ROW_INDEX_END, SPEED_DRYING_INDEX, -1, 0)
    if motion_guard() == false then return false end
    if guarded_wait(DRYING_ROW_INDEX_TIME_MS) == false then return false end
    PTP(A220_DRYING_ROW_RETRACT, SPEED_RETRACT, -1, 0)
    if motion_guard() == false then return false end
    PTP(A250_CYCLE_ENDPOINT, SPEED_TRANSPORT, -1, 0)
    if motion_guard() == false then return false end
    return true
end
