-- Modbus read probe. No robot motion.

start_value = ModbusSlaveReadDI(HMI_START_REQ, 1)
batch_value = ModbusSlaveReadAI(HMI_BATCH_TARGET, 1)

if start_value == 1 or start_value == true then
    ModbusSlaveWriteAO(CELL_STATE, 1, {401})
else
    ModbusSlaveWriteAO(CELL_STATE, 1, {301})
end

ModbusSlaveWriteAO(CELL_FAULT_CODE, 1, {0})
ModbusSlaveWriteAO(CELL_CYCLE_COUNT, 1, {batch_value})
WaitMs(2000)
