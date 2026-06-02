-- Probe 7: write DO table.
ModbusSlaveWriteDO(DO100, 1, {1})
WaitMs(100)
