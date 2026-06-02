-- Mini Modbus alias signature test. No robot motion.
-- This variant uses single-argument alias calls for reads/writes.

DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4

function to_number(value, fallback)
    if value == nil then
        return fallback
    end
    if type(value) == "table" then
        value = value[1]
    end
    if value == true then
        return 1
    end
    if value == false then
        return 0
    end
    return tonumber(value) or fallback
end

function read_hmi_start()
    return to_number(ModbusSlaveReadDO("HMI_START_REQ"), 0)
end

function read_batch_target()
    return to_number(ModbusSlaveReadAI("HMI_BATCH_TARGET"), 0)
end

function write_cell_registers(state, fault, count)
    ModbusSlaveWriteAO("CELL_STATE", {state})
    ModbusSlaveWriteAO("CELL_FAULT_CODE", {fault})
    ModbusSlaveWriteAO("CELL_CYCLE_COUNT", {count})
end

SetDO(DO_LAMP_GREEN, 0, 0, 0)
SetDO(DO_LAMP_ORANGE, 0, 0, 0)
SetDO(DO_LAMP_RED, 0, 0, 0)
write_cell_registers(20, 0, 0)

counter = 0
while counter < 40 do
    start_req = read_hmi_start()
    batch_target = read_batch_target()

    if start_req == 1 then
        SetDO(DO_LAMP_GREEN, 1, 0, 0)
        write_cell_registers(40, 0, batch_target)
    else
        SetDO(DO_LAMP_GREEN, 0, 0, 0)
        write_cell_registers(30, 0, batch_target)
    end

    if batch_target > 0 then
        SetDO(DO_LAMP_ORANGE, 1, 0, 0)
    else
        SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    end

    WaitMs(500)
    counter = counter + 1
end

SetDO(DO_LAMP_GREEN, 0, 0, 0)
SetDO(DO_LAMP_ORANGE, 0, 0, 0)
write_cell_registers(180, 0, counter)
