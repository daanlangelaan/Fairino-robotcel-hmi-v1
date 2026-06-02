-- Generated from fairino/source modules.
-- Variant: full_cycle_with_glue_hmi
-- Generated: 20260526_124726
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
S80_CLAMP_FILTER = 80
S100_APPLY_GLUE = 100
S180_CYCLE_COMPLETE = 180
S900_FAULT = 900
S910_WAIT_RESET = 910
S990_SAFETY_STOP = 990

-- Faults
FAULT_NONE = 0
F001_FILTER_NOT_AVAILABLE = 1
F003_FILTER_NOT_PICKED = 3
F006_CLAMP_NOT_CLOSED = 6
F990_SAFETY_STOP = 990

-- Outputs
DO_GRIPPER_CLOSE = 0
DO_CLAMP_CLOSE = 1
DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4
DO_DEBUG_CLAMP_OK = 5
DO_DEBUG_PICK_OK = 6
DO_DEBUG_PLACE_ENTERED = 7
DO_GLUE_TRIGGER = 8
DO_GLUE_TRIGGER_VISIBLE_SIM = 5

-- Parameters
MAX_FILTER_DISPENSE_RETRIES = 2
GRIPPER_CLOSE_TIME_MS = 300
CLAMP_SETTLE_TIME_MS = 300
INPUT_POLL_MS = 50
PICK_SENSOR_TIMEOUT_MS = 3000
GRIPPER_SENSOR_TIMEOUT_MS = 3000
CLAMP_SENSOR_TIMEOUT_MS = 3000
GLUE_START_DELAY_MS = 300
GLUE_TAIL_DELAY_MS = 300
GLUE_ROTATION_ANGLE_DEG = 340
GLUE_ROTATION_SPEED = 20
GLUE_SERVOJ_TEST_ANGLE_DEG = 120
GLUE_SERVOJ_CYCLE_MS = 80

-- HMI/Modbus integration.
-- Keep disabled until the Fairino Modbus TCP slave aliases are configured.
HMI_MODBUS_ENABLED = 1
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

function all_outputs_off()
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 0, 0, 0)
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
    SetDO(DO_DEBUG_PICK_OK, 0, 0, 0)
    SetDO(DO_DEBUG_PLACE_ENTERED, 0, 0, 0)
    SetDO(DO_DEBUG_CLAMP_OK, 0, 0, 0)
    SetDO(DO_GLUE_TRIGGER, 0, 0, 0)
end

function set_ready_lamps()
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 1, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
end

function set_running_lamps()
    SetDO(DO_LAMP_GREEN, 1, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
end

function set_fault_lamps()
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 1, 0, 0)
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
-- The current simulator build keeps HMI_MODBUS_ENABLED = 0. After the Fairino
-- Modbus TCP slave aliases are configured, this file becomes the single place
-- where the Lua state-machine reads HMI commands and publishes cell status.

HMI_LAST_START_REQ = 0
HMI_LAST_RESET_REQ = 0
HMI_LAST_STOP_REQ = 0

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
    if value == nil then
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
    local rising = hmi_rising_edge(current, HMI_LAST_STOP_REQ)
    HMI_LAST_STOP_REQ = current
    return rising
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

    ModbusSlaveWriteDO(CELL_READY, 1, {current_state == S30_WAIT_START and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_RUNNING, 1, {program_done == 0 and current_state ~= S30_WAIT_START and fault_code == FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_FAULT_ACTIVE, 1, {fault_code ~= FAULT_NONE and 1 or 0})
    ModbusSlaveWriteDO(CELL_SAFETY_OK, 1, {sim_input("safety_ok") and 1 or 0})
    ModbusSlaveWriteDO(CELL_GLUE_ACTIVE, 1, {current_state == S100_APPLY_GLUE and 1 or 0})

    ModbusSlaveWriteAO(CELL_STATE, 1, {current_state})
    ModbusSlaveWriteAO(CELL_FAULT_CODE, 1, {fault_code})
    ModbusSlaveWriteAO(CELL_CYCLE_COUNT, 1, {cycle_counter})
end
-- END hmi_modbus.lua

-- BEGIN motion.lua
-- Robot movement routines for the mini-cell POC.
-- These use the existing simulator teaching points from the earlier pick/place test.

function move_home()
    PTP(P_HOME, 20, -1, 0)
end

function pick_filter_motion()
    PTP(P_PICK_APPROACH, 20, -1, 0)
    Lin(P_PICK, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)
    Lin(P_PICK_APPROACH, 20, -1, 0, 0)
end

function place_filter_motion()
    PTP(P_PLACE_APPROACH, 20, -1, 0)
    Lin(P_PLACE, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
    WaitMs(CLAMP_SETTLE_TIME_MS)
    Lin(P_PLACE_APPROACH, 20, -1, 0, 0)
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
-- END station_filter_dispenser.lua

-- BEGIN station_clamp.lua
-- Clamp station logic for the simulator POC.
-- In the current simulator this still uses P_PLACE_* as stand-in clamp points.
-- Later these names become real clamp station points.

function clamp_place_filter()
    place_filter_motion()
end

function clamp_place_and_verify()
    clamp_place_filter()

    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end

    SetDO(DO_DEBUG_CLAMP_OK, 1, 0, 0)
    return true
end
-- END station_clamp.lua

-- BEGIN station_glue.lua
-- Glue station logic.
-- First simulator version uses existing place points as stand-in glue points.
-- Real cell will get P_GLUE_APPROACH, P_GLUE_CONTACT and P_GLUE_CLEAR.

function glue_move_approach()
    -- Stand-in point for simulator-only test.
    PTP(P_PLACE_APPROACH, GLUE_ROTATION_SPEED, -1, 0)
end

function glue_move_contact()
    -- Stand-in point for simulator-only test.
    Lin(P_PLACE, GLUE_ROTATION_SPEED, -1, 0, 0)
end

function glue_move_clear()
    -- Stand-in point for simulator-only test.
    Lin(P_PLACE_APPROACH, GLUE_ROTATION_SPEED, -1, 0, 0)
end

function glue_rotate_wrist_placeholder()
    -- Fairino supports motion offsets in generated Lin commands:
    -- Lin(point, speed, radius, choice, type, offset, x, y, z, rx, ry, rz)
    -- The webapp field allows up to 300 degrees for drz, so we first test a
    -- visible 300-degree orientation offset. The final process can use a
    -- taught 340-degree endpoint or a split motion if this works.
    Lin(P_PLACE, GLUE_ROTATION_SPEED, -1, 0, 0, 1, 0, 0, 0, 0, 0, 300)
end

function glue_trigger_on()
    SetDO(DO_GLUE_TRIGGER, 1, 0, 0)
    -- Simulator-visible mirror. On real hardware we will remove this or map it
    -- to a spare lamp/output.
    SetDO(DO_GLUE_TRIGGER_VISIBLE_SIM, 1, 0, 0)
end

function glue_trigger_off()
    SetDO(DO_GLUE_TRIGGER, 0, 0, 0)
    SetDO(DO_GLUE_TRIGGER_VISIBLE_SIM, 0, 0, 0)
end

function glue_apply()
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_placeholder()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    glue_move_clear()
end

function glue_apply_j6_numeric_test()
    -- Numeric candidate for visible wrist rotation.
    -- Based on the previously working explicit MoveJ P_PLACE pose.
    -- We step J6/RZ in chunks to make the rotation visible and avoid one huge jump.
    local speed = GLUE_ROTATION_SPEED
    local acc = 180
    local ovl = 30

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,7.379,-330.321,-615.766,224.583,89.273,-7.370,-38.311,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,127.379,-330.321,-615.766,224.583,89.273,-7.370,81.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
    MoveJ(50.975,-56.614,84.472,-28.579,89.379,247.379,-330.321,-615.766,224.583,89.273,-7.370,201.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
    MoveJ(50.975,-56.614,84.472,-28.579,89.379,347.379,-330.321,-615.766,224.583,89.273,-7.370,301.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,7.379,-330.321,-615.766,224.583,89.273,-7.370,-38.311,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
end

function glue_apply_offset_test()
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_placeholder()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    glue_move_clear()
end

function glue_rotate_wrist_servoj_home_test()
    -- Proven in the Fairino simulator: ServoJ changes J6 and Robot panel data.
    -- This home-position test isolates the wrist rotation before we bind it to
    -- a real taught glue point.
    local j1 = 0
    local j2 = -90
    local j3 = 90
    local j4 = -90
    local j5 = -90
    local base_j6 = 0
    local target = GLUE_SERVOJ_TEST_ANGLE_DEG
    local cycle_s = GLUE_SERVOJ_CYCLE_MS / 1000
    local i = 0

    while i <= target do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + i, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end

    i = 1
    while i <= 125 do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + target, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end
end

function glue_apply_servoj_home_test()
    move_home()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_servoj_home_test()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)
end

function glue_rotate_wrist_servoj_place_test()
    -- Temporary simulator glue point based on measured P_PLACE joint values.
    local j1 = 21.799
    local j2 = -101.415
    local j3 = 126.681
    local j4 = -115.266
    local j5 = -90
    local base_j6 = 21.799
    local target = GLUE_SERVOJ_TEST_ANGLE_DEG
    local cycle_s = GLUE_SERVOJ_CYCLE_MS / 1000
    local i = 0

    while i <= target do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + i, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end

    i = 1
    while i <= 125 do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + target, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end
end

function glue_apply_servoj_place_test()
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_servoj_place_test()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)
end
-- END station_glue.lua

-- BEGIN state_machine_once.lua
-- Finite state-machine POC for the simulator.
-- This keeps the Siemens-like state structure, but exits after one cycle.

current_state = S00_INIT
fault_code = FAULT_NONE
cycle_counter = 0
program_done = 0

function wait_sim_input(name, timeout_ms)
    local elapsed = 0
    while elapsed < timeout_ms do
        if sim_input("safety_ok") == false then
            fault_code = F990_SAFETY_STOP
            current_state = S990_SAFETY_STOP
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
    move_home()
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

    pick_filter_motion()

    if wait_sim_input("gripper_filter_present", GRIPPER_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return
    end

    SetDO(DO_DEBUG_PICK_OK, 1, 0, 0)
    current_state = S80_CLAMP_FILTER
end

function state_clamp_filter()
    SetDO(DO_DEBUG_PLACE_ENTERED, 1, 0, 0)
    if clamp_place_and_verify() then
        current_state = S100_APPLY_GLUE
    end
end

function state_apply_glue()
    set_running_lamps()
    glue_apply_servoj_place_test()
    current_state = S180_CYCLE_COMPLETE
end

function state_cycle_complete()
    cycle_counter = cycle_counter + 1
    move_home()
    all_outputs_off()
    set_ready_lamps()
    if HMI_MODBUS_ENABLED == 1 then
        current_state = S30_WAIT_START
        return
    end
    program_done = 1
end

function state_fault()
    all_outputs_off()
    set_fault_lamps()
    program_done = 1
end

function state_safety_stop()
    all_outputs_off()
    set_fault_lamps()
    program_done = 1
end

while program_done == 0 do
    if current_state ~= S990_SAFETY_STOP and sim_input("safety_ok") == false then
        fault_code = F990_SAFETY_STOP
        current_state = S990_SAFETY_STOP
    end

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
    elseif current_state == S80_CLAMP_FILTER then
        state_clamp_filter()
    elseif current_state == S100_APPLY_GLUE then
        state_apply_glue()
    elseif current_state == S180_CYCLE_COMPLETE then
        state_cycle_complete()
    elseif current_state == S900_FAULT then
        state_fault()
    elseif current_state == S990_SAFETY_STOP then
        state_safety_stop()
    else
        raise_fault(999)
    end

    hmi_publish_status()
    WaitMs(INPUT_POLL_MS)
end
-- END state_machine_once.lua

