-- Modbus write probe. No robot motion.

ModbusSlaveWriteDO(CELL_READY, 1, {1})
ModbusSlaveWriteDO(CELL_RUNNING, 1, {0})
ModbusSlaveWriteAO(CELL_STATE, 1, {123})
ModbusSlaveWriteAO(CELL_FAULT_CODE, 1, {0})
ModbusSlaveWriteAO(CELL_CYCLE_COUNT, 1, {7})
WaitMs(2000)
ModbusSlaveWriteDO(CELL_READY, 1, {0})
