-- Remote IO Modbus RTU probe.
-- Profinet is intentionally not used.
--
-- Before running:
-- 1. Configure the Fairino ModbusRTU master in WebApp.
-- 2. Confirm RS485 A/B, slave id, baudrate, parity, stopbits.
-- 3. Disconnect actuator loads; use only a meter or module LED for DO0.
--
-- Assumed first test mapping:
-- - slave id: "1"
-- - DI0 read: function 0x02, address "0", quantity 1
-- - DO0 write: function 0x05, address "0", quantity 1
-- - final parameter 0 = generated WebApp false/no option
--
-- If the module uses 1-based register addressing, change "0" to "1".

RTU_FUNC_READ_COILS = 1
RTU_FUNC_READ_DISCRETE_INPUTS = 2
RTU_FUNC_WRITE_SINGLE_COIL = 5
RTU_SLAVE_ID = "1"
RTU_DI0_ADDRESS = "0"
RTU_DO0_ADDRESS = "0"

-- Read DI0/discrete input first. The return value should become 0 or 1.
di0_before = ModbusRegRead(RTU_FUNC_READ_DISCRETE_INPUTS, RTU_SLAVE_ID, 1, RTU_DI0_ADDRESS, 0)
WaitMs(200)

-- Some modules expose input state as coils. Keep this as a comparison read.
coil0_before = ModbusRegRead(RTU_FUNC_READ_COILS, RTU_SLAVE_ID, 1, RTU_DI0_ADDRESS, 0)
WaitMs(200)

-- Pulse DO0. Keep loads disconnected for this probe.
ModbusRegWrite(RTU_FUNC_WRITE_SINGLE_COIL, RTU_SLAVE_ID, 1, 1, RTU_DO0_ADDRESS, 0)
WaitMs(500)
ModbusRegWrite(RTU_FUNC_WRITE_SINGLE_COIL, RTU_SLAVE_ID, 1, 0, RTU_DO0_ADDRESS, 0)
WaitMs(200)

di0_after = ModbusRegRead(RTU_FUNC_READ_DISCRETE_INPUTS, RTU_SLAVE_ID, 1, RTU_DI0_ADDRESS, 0)
WaitMs(200)
