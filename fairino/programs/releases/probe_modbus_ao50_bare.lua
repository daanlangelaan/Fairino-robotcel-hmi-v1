-- Probe 3: write standard AO alias as bare token, no motion.
ModbusSlaveWriteAO(AO50, 1, {123})
WaitMs(100)
