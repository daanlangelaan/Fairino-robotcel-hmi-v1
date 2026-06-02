-- Fairino mini-cell POC for simulator-only testing.
-- This version does not require real digital inputs.
-- Change the SIM_* values below to force start, reset, product-present,
-- gripper-present, clamp-closed, and safety behavior.

-- Simulated inputs
SIM_SAFETY_OK = 1
SIM_START_BUTTON = 1
SIM_RESET_BUTTON = 0
SIM_FILTER_PRESENT = 1
SIM_GRIPPER_FILTER_PRESENT = 1
SIM_CLAMP_CLOSED = 1

-- Set this to 1 to run only one cycle and then stop in WAIT_START.
SIM_ONE_CYCLE = 1

-- States
S00_INIT = 0
S20_WAIT_READY = 20
S30_WAIT_START = 30
S60_PICK_FILTER = 60
S80_CLAMP_FILTER = 80
S180_CYCLE_COMPLETE = 180
S900_FAULT = 900
S910_WAIT_RESET = 910
S990_SAFETY_STOP = 990

-- Faults
FAULT_NONE = 0
F003_FILTER_NOT_PICKED = 3
F006_CLAMP_NOT_CLOSED = 6
F990_SAFETY_STOP = 990

-- Outputs: DO0 matches the earlier gripper test.
DO_GRIPPER_CLOSE = 0
DO_CLAMP_CLOSE = 1
DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4

-- Parameters
GRIPPER_CLOSE_TIME_MS = 300
CLAMP_SETTLE_TIME_MS = 300
INPUT_POLL_MS = 50
PICK_SENSOR_TIMEOUT_MS = 3000
GRIPPER_SENSOR_TIMEOUT_MS = 3000
CLAMP_SENSOR_TIMEOUT_MS = 3000

current_state = S00_INIT
fault_code = FAULT_NONE
cycle_counter = 0

function safe_outputs()
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 0, 0, 0)
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
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

function pick_filter()
    if wait_sim_input("filter_present", PICK_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return false
    end

    PTP(P_PICK_APPROACH, 20, -1, 0)
    Lin(P_PICK, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)

    if wait_sim_input("gripper_filter_present", GRIPPER_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return false
    end

    Lin(P_PICK_APPROACH, 20, -1, 0, 0)
    return true
end

function clamp_filter()
    -- Simulator POC uses the existing place points from the earlier test.
    -- Later these become P_CLAMP_APPROACH and P_CLAMP_PLACE.
    PTP(P_PLACE_APPROACH, 20, -1, 0)
    Lin(P_PLACE, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)
    Lin(P_PLACE_APPROACH, 20, -1, 0, 0)

    SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
    WaitMs(CLAMP_SETTLE_TIME_MS)

    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end

    return true
end

while true do
    if current_state ~= S990_SAFETY_STOP and sim_input("safety_ok") == false then
        fault_code = F990_SAFETY_STOP
        current_state = S990_SAFETY_STOP
    end

    if current_state == S00_INIT then
        safe_outputs()
        SetDO(DO_LAMP_RED, 0, 0, 0)
        fault_code = FAULT_NONE
        PTP(P_HOME, 20, -1, 0)
        current_state = S20_WAIT_READY

    elseif current_state == S20_WAIT_READY then
        if sim_input("safety_ok") then
            current_state = S30_WAIT_START
        else
            current_state = S990_SAFETY_STOP
        end

    elseif current_state == S30_WAIT_START then
        set_ready_lamps()
        if SIM_ONE_CYCLE == 1 and cycle_counter > 0 then
            SIM_START_BUTTON = 0
        end
        if sim_input("start") then
            current_state = S60_PICK_FILTER
        end

    elseif current_state == S60_PICK_FILTER then
        set_running_lamps()
        if pick_filter() then
            current_state = S80_CLAMP_FILTER
        end

    elseif current_state == S80_CLAMP_FILTER then
        if clamp_filter() then
            current_state = S180_CYCLE_COMPLETE
        end

    elseif current_state == S180_CYCLE_COMPLETE then
        cycle_counter = cycle_counter + 1
        current_state = S30_WAIT_START

    elseif current_state == S900_FAULT then
        safe_outputs()
        set_fault_lamps()
        current_state = S910_WAIT_RESET

    elseif current_state == S910_WAIT_RESET then
        set_fault_lamps()
        if sim_input("reset") and sim_input("safety_ok") then
            current_state = S00_INIT
        end

    elseif current_state == S990_SAFETY_STOP then
        safe_outputs()
        set_fault_lamps()
        if sim_input("reset") and sim_input("safety_ok") then
            current_state = S00_INIT
        end
    end

    WaitMs(INPUT_POLL_MS)
end
