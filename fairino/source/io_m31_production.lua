-- Production I/O driver for the definitive robot cell.
--
-- All ordinary field I/O is read from or written to the Ebyte M31 over
-- Modbus TCP. Safety remains hardwired; M31 DI1 is diagnostic feedback only.
-- M31_REMOTE_IO, M31_DI_0 and M31_DO_0 are aliases configured in the FAIRINO
-- WebApp and are intentionally not numeric literals in this source file.

M31_OUTPUT_ACTIVE_LEVEL = 1
M31_OUTPUT_INACTIVE_LEVEL = 0
M31_OUTPUT_SHADOW = {}

for channel = 1, M31_DO_COUNT do
    M31_OUTPUT_SHADOW[channel] = M31_OUTPUT_INACTIVE_LEVEL
end

-- Preserve the actual remote coil state across a Lua restart. This is
-- especially important when the gripper is holding a product.
local startup_outputs = {ModbusMasterReadDO(M31_REMOTE_IO, M31_DO_0, M31_DO_COUNT)}
for channel = 1, M31_DO_COUNT do
    if startup_outputs[channel] == M31_OUTPUT_ACTIVE_LEVEL then
        M31_OUTPUT_SHADOW[channel] = M31_OUTPUT_ACTIVE_LEVEL
    end
end

GRIPPER_COMMAND_CLOSED = 0
if M31_OUTPUT_SHADOW[DO_GRIPPER_CLOSE + 1] == M31_OUTPUT_ACTIVE_LEVEL then
    GRIPPER_COMMAND_CLOSED = 1
end

function m31_flush_outputs()
    ModbusMasterWriteDO(M31_REMOTE_IO, M31_DO_0, M31_DO_COUNT, M31_OUTPUT_SHADOW)
end

function set_output(port, active)
    if port < 0 or port >= M31_DO_COUNT then
        return
    end

    if port == DO_GRIPPER_CLOSE then
        if active then
            GRIPPER_COMMAND_CLOSED = 1
        else
            GRIPPER_COMMAND_CLOSED = 0
        end
    end

    if active then
        M31_OUTPUT_SHADOW[port + 1] = M31_OUTPUT_ACTIVE_LEVEL
    else
        M31_OUTPUT_SHADOW[port + 1] = M31_OUTPUT_INACTIVE_LEVEL
    end
    m31_flush_outputs()
end

function m31_process_input_address(signal)
    if signal == "safety_ok" then return M31_DI_SAFETY_DIAGNOSTIC end
    if signal == "filter_present" then
        local dispenser = active_filter_dispenser
        if dispenser == nil or dispenser < 1 or dispenser > 6 then dispenser = 1 end
        return FILTER_DISPENSER_INPUTS[dispenser]
    end
    if signal == "gripper_filter_present" then return DI_GRIPPER_FILTER_POSITION end
    if signal == "gripper_check_valve_present" then return DI_GRIPPER_CHECK_VALVE_POSITION end
    if signal == "clamp_open" then return DI_FILTER_CLAMP_OPEN end
    if signal == "clamp_closed" then return DI_FILTER_CLAMP_CLOSED end
    if signal == "press_home" then return DI_PRESS_HOME end
    if signal == "press_inserted" then return DI_PRESS_INSERTED end
    if signal == "check_valve_present" then return DI_CHECK_VALVE_PICK_PRESENT end
    if signal == "check_valve_gate_open" then return DI_CHECK_VALVE_GATE_OPEN end
    if signal == "check_valve_gate_closed" then return DI_CHECK_VALVE_GATE_CLOSED end
    if signal == "air_pressure_ok" then return DI_AIR_PRESSURE_OK end
    if signal == "drying_position_occupied" then return DI_DRYING_POSITION_OCCUPIED end
    return -1
end

function process_input(signal)
    local port = signal
    if type(signal) == "string" then
        port = m31_process_input_address(signal)
    end
    if port < 0 or port >= M31_DI_COUNT then
        return false
    end
    local values = {ModbusMasterReadDI(M31_REMOTE_IO, M31_DI_0, M31_DI_COUNT)}
    return values[port + 1] == 1
end

function gripper_is_commanded_closed()
    return GRIPPER_COMMAND_CLOSED == 1
end

function set_debug_output(name, active)
    -- Simulator-only indicators are deliberately suppressed in production.
end

function all_outputs_off_except_gripper()
    for port = 0, M31_DO_COUNT - 1 do
        if port ~= DO_GRIPPER_CLOSE then
            M31_OUTPUT_SHADOW[port + 1] = M31_OUTPUT_INACTIVE_LEVEL
        end
    end
    m31_flush_outputs()
end

function all_outputs_off()
    for port = 0, M31_DO_COUNT - 1 do
        M31_OUTPUT_SHADOW[port + 1] = M31_OUTPUT_INACTIVE_LEVEL
    end
    GRIPPER_COMMAND_CLOSED = 0
    m31_flush_outputs()
end

function set_ready_lamps()
    set_output(DO_LAMP_GREEN, false)
    set_output(DO_LAMP_ORANGE, true)
    set_output(DO_LAMP_RED, false)
    set_output(DO_LAMP_BLUE, false)
end

function set_running_lamps()
    set_output(DO_LAMP_GREEN, true)
    set_output(DO_LAMP_ORANGE, false)
    set_output(DO_LAMP_RED, false)
    set_output(DO_LAMP_BLUE, false)
end

function set_fault_lamps()
    set_output(DO_LAMP_GREEN, false)
    set_output(DO_LAMP_ORANGE, false)
    set_output(DO_LAMP_RED, true)
end
