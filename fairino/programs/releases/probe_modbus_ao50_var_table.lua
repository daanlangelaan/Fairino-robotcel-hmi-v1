-- Probe 6: write AO with one variable table.
val = 123
ModbusSlaveWriteAO(AO50, 1, {val})
WaitMs(100)
