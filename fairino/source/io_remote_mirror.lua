-- Optional Remote IO output mirror for commissioning.
--
-- The Fairino controller outputs remain authoritative. When the mirror is
-- enabled, every logical output command is also written to the corresponding
-- Modbus TCP coil. This is intended only for LED/no-load commissioning before
-- any production IO is moved.
--
-- Target hardware:
-- - host: M31-AXXXA000G-U (16DI)
-- - DI expansion: M31-GAXXXA000-U (16DI)
-- - DO expansion: M31-GXXAX00A0-U (16DO)
--
-- Required Fairino WebApp ModbusTCP aliases:
-- - master: M31_REMOTE_IO
-- - DI address 0: M31_DI_0
-- - DO address 0: M31_DO_0

REMOTE_IO_OUTPUT_SHADOW = {}
for channel = 1, REMOTE_IO_DO_COUNT do
    REMOTE_IO_OUTPUT_SHADOW[channel] = REMOTE_IO_OUTPUT_INACTIVE_LEVEL
end

function remote_io_write_output(port, active)
    if REMOTE_IO_OUTPUT_MIRROR_ENABLED ~= 1 then
        return
    end
    if port < 0 or port >= REMOTE_IO_DO_COUNT then
        return
    end

    local value = REMOTE_IO_OUTPUT_INACTIVE_LEVEL
    if active then
        value = REMOTE_IO_OUTPUT_ACTIVE_LEVEL
    end

    REMOTE_IO_OUTPUT_SHADOW[port + 1] = value
    ModbusMasterWriteDO(
        M31_REMOTE_IO,
        M31_DO_0,
        REMOTE_IO_DO_COUNT,
        REMOTE_IO_OUTPUT_SHADOW
    )
end

-- Available for commissioning probes. Production logic continues to use the
-- existing Fairino/simulator input path until the remote input migration is
-- explicitly approved and tested.
function remote_io_read_input(port)
    if port < 0 or port >= REMOTE_IO_DI_COUNT then
        return 0
    end

    local values = {ModbusMasterReadDI(M31_REMOTE_IO, M31_DI_0, REMOTE_IO_DI_COUNT)}
    return values[port + 1]
end
