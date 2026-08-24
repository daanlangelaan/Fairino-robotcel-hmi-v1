-- No-op Remote IO layer for controller builds without the optional M31 mirror.
-- Keeping these functions available lets the shared IO layer remain identical,
-- while avoiding parser references to Modbus aliases that may not be configured.

function remote_io_write_output(port, active)
end

function remote_io_read_input(port)
    return 0
end
