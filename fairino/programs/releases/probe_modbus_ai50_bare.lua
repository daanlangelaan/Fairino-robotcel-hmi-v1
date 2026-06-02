-- Probe 1: read standard AI alias as bare token, no motion.
v = ModbusSlaveReadAI(AI50, 1)
WaitMs(100)
