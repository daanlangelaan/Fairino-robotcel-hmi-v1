-- Standalone M31 Modbus TCP output LED test.
--
-- Preconditions:
-- 1. Use the photographed Modbus set: M31-AXXXA000G-U host with the
--    M31-GXXAX00A0-U 16DO expansion.
-- 2. Disconnect every actuator/load from the remote DO terminals.
-- 3. Configure a Fairino ModbusTCP master named M31_REMOTE_IO and add a DO
--    register named M31_DO_0 at coil address 0 before opening this program.
-- 4. Keep the Fairino production program stopped. This program does not write
--    any Fairino controller DO.
--
-- The ordinary M31 Modbus manual defines DO coils as zero-based and continuous
-- per IO type. A 16DI host plus a 16DO expansion therefore starts at DO 0.

REMOTE_DO_START_ADDRESS = 0
REMOTE_DO_COUNT = 16
LED_ON_TIME_MS = 750
LED_BETWEEN_TIME_MS = 250

REMOTE_DO_VALUES = {}
for channel = 1, REMOTE_DO_COUNT do
    REMOTE_DO_VALUES[channel] = 0
end

function write_remote_outputs()
    ModbusMasterWriteDO(M31_REMOTE_IO, M31_DO_0, REMOTE_DO_COUNT, REMOTE_DO_VALUES)
end

function set_remote_do(channel, value)
    REMOTE_DO_VALUES[channel + 1] = value
    write_remote_outputs()
end

-- Establish a known-safe all-off state first.
write_remote_outputs()
WaitMs(500)

-- Walk one LED at a time from DO0 through DO15.
for channel = 0, REMOTE_DO_COUNT - 1 do
    set_remote_do(channel, 1)
    WaitMs(LED_ON_TIME_MS)
    set_remote_do(channel, 0)
    WaitMs(LED_BETWEEN_TIME_MS)
end

-- Always finish with every remote output off.
for channel = 0, REMOTE_DO_COUNT - 1 do
    REMOTE_DO_VALUES[channel + 1] = 0
end
write_remote_outputs()
WaitMs(500)
