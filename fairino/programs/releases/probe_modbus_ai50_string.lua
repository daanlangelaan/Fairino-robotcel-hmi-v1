-- Probe 2: read standard AI alias as string, no motion.
v = ModbusSlaveReadAI("AI50", 1)
WaitMs(100)
