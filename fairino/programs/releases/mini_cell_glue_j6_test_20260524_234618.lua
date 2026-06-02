-- Generated from fairino/source modules.
-- Variant: glue_j6_test
-- Generated: 20260524_234618
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
    if sim_input("start") then
        current_state = S40_SELECT_FILTER_DISPENSER
    else
        program_done = 1
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
        current_state = S180_CYCLE_COMPLETE
    end
end

function state_cycle_complete()
    cycle_counter = cycle_counter + 1
    move_home()
    all_outputs_off()
    set_ready_lamps()
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
    elseif current_state == S180_CYCLE_COMPLETE then
        state_cycle_complete()
    elseif current_state == S900_FAULT then
        state_fault()
    elseif current_state == S990_SAFETY_STOP then
        state_safety_stop()
    else
        raise_fault(999)
    end

    WaitMs(INPUT_POLL_MS)
end
-- END state_machine_once.lua

