-- Modbus signature probe. No robot motion.

DO_LAMP_GREEN = 2
SetDO(DO_LAMP_GREEN, 0, 0, 0)

value = ModbusSlaveReadDI(HMI_START_REQ, 1)
SetDO(DO_LAMP_GREEN, value, 0, 0)
