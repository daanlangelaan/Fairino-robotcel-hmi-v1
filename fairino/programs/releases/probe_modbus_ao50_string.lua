-- Probe 4: write standard AO alias as string, no motion.
ModbusSlaveWriteAO("AO50", 1, {123})
WaitMs(100)
