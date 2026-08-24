-- Simulator IO helpers.
-- Replace these later with real GetDI/SetDO helpers or register-based HMI IO.

SIM_SAFETY_OK = 1
SIM_START_BUTTON = 1
SIM_RESET_BUTTON = 0
SIM_FILTER_PRESENT = 1
SIM_GRIPPER_FILTER_PRESENT = 1
SIM_CLAMP_CLOSED = 1

-- Fairino controlbox DOs drive external standalone optocouplers. The actuator
-- side uses NC contacts, so the controlbox output is high by default and an IO
-- trigger pulls the output low. Remote IO may need a different polarity layer.
OUTPUT_ACTIVE_LEVEL = 0
OUTPUT_INACTIVE_LEVEL = 1

-- Preserve an already closed gripper across a stopped-program/controller-fault
-- restart. GetDO reads the physical control-box output level; this survives the
-- Lua variable reset that occurs when the program starts again.
GRIPPER_COMMAND_CLOSED = 0
if GetDO(DO_GRIPPER_CLOSE, 0) == OUTPUT_ACTIVE_LEVEL then
    GRIPPER_COMMAND_CLOSED = 1
end

function set_output(port, active)
    if port == DO_GRIPPER_CLOSE then
        if active then
            GRIPPER_COMMAND_CLOSED = 1
        else
            GRIPPER_COMMAND_CLOSED = 0
        end
    end

    if active then
        SetDO(port, OUTPUT_ACTIVE_LEVEL, 0, 0)
    else
        SetDO(port, OUTPUT_INACTIVE_LEVEL, 0, 0)
    end

    -- Optional no-load commissioning mirror. The controller output above is
    -- deliberately written first and remains the primary output path.
    remote_io_write_output(port, active)
end

function gripper_is_commanded_closed()
    return GRIPPER_COMMAND_CLOSED == 1
end

function all_outputs_off_except_gripper()
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

function all_outputs_off()
    set_output(DO_GRIPPER_CLOSE, false)
    all_outputs_off_except_gripper()
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
