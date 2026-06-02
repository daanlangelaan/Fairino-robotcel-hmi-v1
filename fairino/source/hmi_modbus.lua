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
    local rising = hmi_rising_edge(current, HMI_LAST_STOP_REQ)
    HMI_LAST_STOP_REQ = current
    return rising
end

function hmi_estop_requested()
    local current = 0
    if HMI_MODBUS_ENABLED == 1 then
        current = hmi_bool(ModbusSlaveReadDI(HMI_ESTOP_REQ, 1))
    end

    local rising = hmi_rising_edge(current, HMI_LAST_ESTOP_REQ)
    HMI_LAST_ESTOP_REQ = current
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
