-- No-op HMI layer for builds that run without Fairino Modbus slave aliases.

function hmi_read_batch_target()
    return 1
end

function hmi_start_requested()
    return sim_input("start")
end

function hmi_stop_requested()
    return false
end

function hmi_estop_requested()
    return false
end

function hmi_reset_requested()
    return sim_input("reset")
end

function hmi_publish_status()
end
