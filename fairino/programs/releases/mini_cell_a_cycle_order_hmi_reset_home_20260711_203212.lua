-- Generated from fairino/source modules.
-- Variant: a_cycle_order_hmi_reset_home
-- Generated: 20260711_203212
-- Upload this uniquely named file to avoid Fairino WebApp cache/name confusion.

-- BEGIN config.lua
-- Shared constants for the Fairino mini-cell POC.

-- States
S00_INIT = 0
S20_WAIT_READY = 20
S30_WAIT_START = 30
S40_SELECT_FILTER_DISPENSER = 40
S50_DISPENSE_FILTER = 50
S60_PICK_FILTER = 60
S70_PLACE_FILTER_IN_CLAMP = 70
S80_CLAMP_FILTER = 80
S90_DISPENSE_CHECK_VALVE = 90
S100_PICK_CHECK_VALVE = 100
S110_APPLY_GLUE = 110
S120_INSERT_CHECK_VALVE = 120
S130_PRESS_CHECK_VALVE = 130
S140_UNCLAMP_FILTER = 140
S150_PICK_FINISHED_FILTER = 150
S160_PLACE_IN_DRYING_ROW = 160
S170_INDEX_DRYING_ROW = 170
S180_CYCLE_COMPLETE = 180
S190_CHECK_NEXT_CYCLE = 190
S800_MATERIAL_EMPTY = 800
S850_BATCH_COMPLETE = 850
S900_FAULT = 900
S910_WAIT_RESET = 910
S990_SAFETY_STOP = 990

-- Faults
FAULT_NONE = 0
F001_FILTER_NOT_AVAILABLE = 1
F003_FILTER_NOT_PICKED = 3
F006_CLAMP_NOT_CLOSED = 6
F010_CHECK_VALVE_NOT_AVAILABLE = 10
F011_CHECK_VALVE_NOT_PICKED = 11
F012_CHECK_VALVE_NOT_INSERTED = 12
F990_SAFETY_STOP = 990
F991_HMI_ESTOP = 991

-- Outputs
DO_GRIPPER_CLOSE = 0
DO_CLAMP_CLOSE = 1
DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4
DO_CHECK_VALVE_PRESS = 5
DO_CHECK_VALVE_FEED = 6
DO_DEBUG_CLAMP_OK = 2
DO_DEBUG_PICK_OK = 3
DO_DEBUG_PLACE_ENTERED = 4
DO_GLUE_TRIGGER = 7
DO_GLUE_TRIGGER_VISIBLE_SIM = 4

-- Parameters
MAX_FILTER_DISPENSE_RETRIES = 2
GRIPPER_CLOSE_TIME_MS = 300
CLAMP_SETTLE_TIME_MS = 300
INPUT_POLL_MS = 50
PICK_SENSOR_TIMEOUT_MS = 3000
GRIPPER_SENSOR_TIMEOUT_MS = 3000
CLAMP_SENSOR_TIMEOUT_MS = 3000
PRESS_SETTLE_TIME_MS = 300
CHECK_VALVE_PRESS_TIME_MS = 500
CHECK_VALVE_FEED_SETTLE_TIME_MS = 1000
DRYING_ROW_INDEX_TIME_MS = 300
GLUE_START_DELAY_MS = 300
GLUE_TAIL_DELAY_MS = 300

-- Motion speed percentages. Fairino applies these under the global speed
-- override shown in the WebApp header.
SPEED_HOME = 50
SPEED_TRANSPORT = 55
SPEED_APPROACH = 40
SPEED_PICK_PLACE = 25
SPEED_RETRACT = 40
SPEED_DRYING_INDEX = 35
GLUE_ROTATION_SPEED = 20

-- HMI/Modbus integration.
-- Keep disabled until the Fairino Modbus TCP slave aliases are configured.
HMI_MODBUS_ENABLED = 1

-- Defaults used while the Fairino WebApp validates Modbus instructions during
-- file open. The state machine overwrites these at runtime.
current_state = S00_INIT
fault_code = FAULT_NONE
cycle_counter = 0
program_done = 0
a = 0
b = 0
c = 0
d = 1
heartbeat_bit = 0
-- END config.lua

-- BEGIN io_sim.lua
-- Simulator IO helpers.
-- Replace these later with real GetDI/SetDO helpers or register-based HMI IO.

SIM_SAFETY_OK = 1
SIM_START_BUTTON = 1
SIM_RESET_BUTTON = 0
SIM_FILTER_PRESENT = 1
SIM_GRIPPER_FILTER_PRESENT = 1
SIM_CLAMP_CLOSED = 1

OUTPUT_ACTIVE_LEVEL = 0
OUTPUT_INACTIVE_LEVEL = 1

function set_output(port, active)
    if active then
        SetDO(port, OUTPUT_ACTIVE_LEVEL, 0, 0)
    else
        SetDO(port, OUTPUT_INACTIVE_LEVEL, 0, 0)
    end
end

function all_outputs_off()
    set_output(DO_GRIPPER_CLOSE, false)
    set_output(DO_CLAMP_CLOSE, false)
    set_output(DO_CHECK_VALVE_PRESS, false)
    set_output(DO_CHECK_VALVE_FEED, false)
    set_output(DO_LAMP_GREEN, false)
    set_output(DO_LAMP_ORANGE, false)
    set_output(DO_LAMP_RED, false)
    set_output(DO_DEBUG_PICK_OK, false)
    set_output(DO_DEBUG_PLACE_ENTERED, false)
    set_output(DO_DEBUG_CLAMP_OK, false)
    set_output(DO_GLUE_TRIGGER, false)
end

function set_ready_lamps()
    set_output(DO_LAMP_GREEN, false)
    set_output(DO_LAMP_ORANGE, true)
    set_output(DO_LAMP_RED, false)
end

function set_running_lamps()
    set_output(DO_LAMP_GREEN, true)
    set_output(DO_LAMP_ORANGE, false)
    set_output(DO_LAMP_RED, false)
end

function set_fault_lamps()
    set_output(DO_LAMP_GREEN, false)
    set_output(DO_LAMP_ORANGE, false)
    set_output(DO_LAMP_RED, true)
end

function sim_input(name)
    if name == "safety_ok" then return SIM_SAFETY_OK == 1 end
    if name == "start" then return SIM_START_BUTTON == 1 end
    if name == "reset" then return SIM_RESET_BUTTON == 1 end
    if name == "filter_present" then return SIM_FILTER_PRESENT == 1 end
    if name == "gripper_filter_present" then return SIM_GRIPPER_FILTER_PRESENT == 1 end
    if name == "clamp_closed" then return SIM_CLAMP_CLOSED == 1 end
    return false
end
-- END io_sim.lua

-- BEGIN hmi_modbus.lua
-- HMI Modbus interface layer.
-- This file is the single place where the Lua state-machine reads HMI commands
-- and publishes cell status through the Fairino Modbus TCP slave aliases.

HMI_LAST_START_REQ = 0
HMI_LAST_RESET_REQ = 0
HMI_LAST_STOP_REQ = 0
HMI_LAST_ESTOP_REQ = 0
HMI_ROBOT_HEARTBEAT = 0

function hmi_bool(value)
    if value == true then
        return 1
    end
    if value == 1 then
        return 1
    end
    return 0
end

function hmi_read_batch_target()
    if HMI_MODBUS_ENABLED ~= 1 then
        return 1
    end

    local value = ModbusSlaveReadAI(HMI_BATCH_TARGET, 1)
    if value == nil or value < 1 then
        return 1
    end
    return value
end

function hmi_rising_edge(current, last)
    if current == 1 and last == 0 then
        return true
    end
    return false
end

function hmi_start_requested()
    local current = 0
    if HMI_MODBUS_ENABLED == 1 then
        current = hmi_bool(ModbusSlaveReadDI(HMI_START_REQ, 1))
    end
    if HMI_MODBUS_ENABLED ~= 1 and sim_input("start") then
        current = 1
    end

    local rising = hmi_rising_edge(current, HMI_LAST_START_REQ)
    HMI_LAST_START_REQ = current
    return rising
end

function hmi_stop_requested()
    local current = 0
    if HMI_MODBUS_ENABLED == 1 then
        current = hmi_bool(ModbusSlaveReadDI(HMI_STOP_REQ, 1))
    end
    HMI_LAST_STOP_REQ = current
    return current == 1
end

function hmi_estop_requested()
    local current = 0
    if HMI_MODBUS_ENABLED == 1 then
        current = hmi_bool(ModbusSlaveReadDI(HMI_ESTOP_REQ, 1))
    end

    HMI_LAST_ESTOP_REQ = current
    return current == 1
end

function hmi_reset_requested()
    local current = 0
    if HMI_MODBUS_ENABLED == 1 then
        current = hmi_bool(ModbusSlaveReadDI(HMI_RESET_REQ, 1))
    end
    if HMI_MODBUS_ENABLED ~= 1 and sim_input("reset") then
        current = 1
    end

    local rising = hmi_rising_edge(current, HMI_LAST_RESET_REQ)
    HMI_LAST_RESET_REQ = current
    return rising
end

function hmi_publish_status()
    if HMI_MODBUS_ENABLED ~= 1 then
        return
    end

    HMI_ROBOT_HEARTBEAT = HMI_ROBOT_HEARTBEAT + 1
    if HMI_ROBOT_HEARTBEAT > 65535 then
        HMI_ROBOT_HEARTBEAT = 0
    end

    ModbusSlaveWriteDO(CELL_READY, 1, {current_state == S30_WAIT_START and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_RUNNING, 1, {program_done == 0 and current_state ~= S30_WAIT_START and current_state ~= S850_BATCH_COMPLETE and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_FAULT_ACTIVE, 1, {fault_code ~= FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_SAFETY_OK, 1, {sim_input("safety_ok") and fault_code ~= F991_HMI_ESTOP and 1 or 0})
    ModbusSlaveWriteDO(CELL_GLUE_ACTIVE, 1, {current_state == S110_APPLY_GLUE and 1 or 0})
    ModbusSlaveWriteDO(CELL_CLAMP_CLOSED, 1, {current_state >= S80_CLAMP_FILTER and current_state < S140_UNCLAMP_FILTER and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_GRIPPER_OK, 1, {current_state >= S60_PICK_FILTER and current_state < S160_PLACE_IN_DRYING_ROW and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_BATCH_COMPLETE, 1, {current_state == S850_BATCH_COMPLETE and 1 or 0})
    ModbusSlaveWriteDO(CELL_COMMS_OK, 1, {1})

    ModbusSlaveWriteAO(CELL_STATE, 1, {current_state})
    ModbusSlaveWriteAO(CELL_FAULT_CODE, 1, {fault_code})
    ModbusSlaveWriteAO(CELL_CYCLE_COUNT, 1, {cycle_counter})
    ModbusSlaveWriteAO(CELL_BATCH_TARGET_ECHO, 1, {hmi_read_batch_target()})
    ModbusSlaveWriteAO(CELL_BATCH_DONE, 1, {cycle_counter})
    ModbusSlaveWriteAO(CELL_ROBOT_HEARTBEAT, 1, {HMI_ROBOT_HEARTBEAT})
end
-- END hmi_modbus.lua

-- BEGIN motion.lua
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
-- END motion.lua

-- BEGIN station_filter_dispenser.lua
-- Filter dispenser skeleton for the next expansion step.
-- For now this models one simulated dispenser. Later this becomes 1..8.

filter_dispense_attempts = 0
filter_dispenser_empty = 0
active_filter_dispenser = 1

function filter_dispenser_has_filter_ready()
    return sim_input("filter_present")
end

function filter_dispenser_select()
    if filter_dispenser_empty == 1 then
        return false
    end

    return true
end

function filter_dispenser_prepare_pick()
    filter_dispense_attempts = 0

    if filter_dispenser_select() == false then
        return false
    end

    if filter_dispenser_has_filter_ready() then
        return true
    end

    while filter_dispense_attempts < MAX_FILTER_DISPENSE_RETRIES do
        -- Later: robot presses dispenser lever here.
        filter_dispense_attempts = filter_dispense_attempts + 1

        if filter_dispenser_has_filter_ready() then
            return true
        end
    end

    filter_dispenser_empty = 1
    return false
end

function check_valve_dispenser_prepare_pick()
    set_output(DO_CHECK_VALVE_FEED, true)
    if guarded_wait(CHECK_VALVE_FEED_SETTLE_TIME_MS) == false then
        set_output(DO_CHECK_VALVE_FEED, false)
        return false
    end
    return true
end
-- END station_filter_dispenser.lua

-- BEGIN station_clamp.lua
-- Clamp, press, and drying-row station helpers for the simulator POC.

function clamp_close_and_verify()
    set_output(DO_CLAMP_CLOSE, true)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end
    set_output(DO_DEBUG_CLAMP_OK, true)
    return true
end

function clamp_open_and_verify()
    set_output(DO_CLAMP_CLOSE, false)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    set_output(DO_DEBUG_CLAMP_OK, false)
    return true
end

function press_check_valve_and_verify()
    set_output(DO_CHECK_VALVE_PRESS, true)
    if guarded_wait(CHECK_VALVE_PRESS_TIME_MS) == false then
        set_output(DO_CHECK_VALVE_PRESS, false)
        return false
    end
    set_output(DO_CHECK_VALVE_PRESS, false)
    if guarded_wait(PRESS_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F012_CHECK_VALVE_NOT_INSERTED)
        return false
    end
    return true
end
-- END station_clamp.lua

-- BEGIN station_glue.lua
-- Glue station logic.
-- Demo version uses A110/A120/A125/A130 points. Real cell keeps these names and
-- updates the taught coordinates.

function glue_move_approach()
    if motion_guard() == false then return false end
    PTP(A110_GLUE_APPROACH, GLUE_ROTATION_SPEED, -1, 0)
    return motion_guard()
end

function glue_move_contact()
    if motion_guard() == false then return false end
    Lin(A120_GLUE_START, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_move_rotation_end()
    if motion_guard() == false then return false end
    PTP(A125_GLUE_END, GLUE_ROTATION_SPEED, -1, 0)
    return motion_guard()
end

function glue_move_clear()
    if motion_guard() == false then return false end
    Lin(A130_GLUE_RETRACT, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_trigger_on()
    set_output(DO_GLUE_TRIGGER, true)
    -- Simulator-visible mirror. On real hardware we will remove this or map it
    -- to a spare lamp/output.
    set_output(DO_GLUE_TRIGGER_VISIBLE_SIM, true)
end

function glue_trigger_off()
    set_output(DO_GLUE_TRIGGER, false)
    set_output(DO_GLUE_TRIGGER_VISIBLE_SIM, false)
end

function glue_apply()
    if glue_move_approach() == false then return false end
    if glue_move_contact() == false then return false end

    glue_trigger_on()
    if guarded_wait(GLUE_START_DELAY_MS) == false then glue_trigger_off() return false end

    if glue_move_rotation_end() == false then glue_trigger_off() return false end

    glue_trigger_off()
    if guarded_wait(GLUE_TAIL_DELAY_MS) == false then return false end

    if glue_move_clear() == false then return false end
    return true
end
-- END station_glue.lua

-- BEGIN state_machine_once.lua
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
    all_outputs_off()
    fault_code = FAULT_NONE
    if move_home() == false then return end
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
    else
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
    all_outputs_off()
    set_fault_lamps()
    if HMI_MODBUS_ENABLED == 1 then
        current_state = S910_WAIT_RESET
        return
    end
    program_done = 1
end

function state_wait_reset()
    all_outputs_off()
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
-- END state_machine_once.lua

