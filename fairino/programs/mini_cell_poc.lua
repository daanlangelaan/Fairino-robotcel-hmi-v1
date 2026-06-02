-- Fairino mini-cell POC
-- Goal: prove state machine, IO, motion, fault, and reset behavior in Lua.
-- This follows the simple command style already tested:
--   PTP(point, speed, -1, radius)
--   Lin(point, speed, -1, radius, 0)
--   SetDO(port, value, 0, 0)
--   WaitMs(ms)

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

-- Inputs: adapt port numbers after wiring is fixed.
DI_SAFETY_OK = 0
DI_START_BUTTON = 1
DI_RESET_BUTTON = 2
DI_FILTER_PRESENT = 3
DI_GRIPPER_FILTER_PRESENT = 4
DI_CLAMP_CLOSED = 5

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

function di_is_on(port)
    -- Fairino graphical conditions generate: GetDI(port) == value.
    -- If the real controller needs another form, adapt this function only.
    return GetDI(port) == 1
end

function wait_di_on(port, timeout_ms)
    local elapsed = 0
    while elapsed < timeout_ms do
        if di_is_on(DI_SAFETY_OK) == false then
            fault_code = F990_SAFETY_STOP
            current_state = S990_SAFETY_STOP
            return false
        end

        if di_is_on(port) then
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
    if wait_di_on(DI_FILTER_PRESENT, PICK_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return false
    end

    PTP(P_PICK_APPROACH, 20, -1, 0)
    Lin(P_PICK, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)

    if wait_di_on(DI_GRIPPER_FILTER_PRESENT, GRIPPER_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F003_FILTER_NOT_PICKED)
        return false
    end

    Lin(P_PICK_APPROACH, 20, -1, 0, 0)
    return true
end

function clamp_filter()
    PTP(P_CLAMP_APPROACH, 20, -1, 0)
    Lin(P_CLAMP_PLACE, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)
    Lin(P_CLAMP_APPROACH, 20, -1, 0, 0)

    SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
    WaitMs(CLAMP_SETTLE_TIME_MS)

    if wait_di_on(DI_CLAMP_CLOSED, CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end

    return true
end

while true do
    if current_state ~= S990_SAFETY_STOP and di_is_on(DI_SAFETY_OK) == false then
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
        if di_is_on(DI_SAFETY_OK) then
            current_state = S30_WAIT_START
        else
            current_state = S990_SAFETY_STOP
        end

    elseif current_state == S30_WAIT_START then
        set_ready_lamps()
        if di_is_on(DI_START_BUTTON) then
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
        if di_is_on(DI_RESET_BUTTON) and di_is_on(DI_SAFETY_OK) then
            current_state = S00_INIT
        end

    elseif current_state == S990_SAFETY_STOP then
        safe_outputs()
        set_fault_lamps()
        if di_is_on(DI_RESET_BUTTON) and di_is_on(DI_SAFETY_OK) then
            current_state = S00_INIT
        end
    end

    WaitMs(INPUT_POLL_MS)
end
