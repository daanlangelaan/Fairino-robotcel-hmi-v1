-- Clamp, press, and drying-row station helpers for the simulator POC.

function clamp_close_and_verify()
    SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end
    SetDO(DO_DEBUG_CLAMP_OK, 1, 0, 0)
    return true
end

function clamp_open_and_verify()
    SetDO(DO_CLAMP_CLOSE, 0, 0, 0)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    SetDO(DO_DEBUG_CLAMP_OK, 0, 0, 0)
    return true
end

function press_check_valve_and_verify()
    if guarded_wait(PRESS_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F012_CHECK_VALVE_NOT_INSERTED)
        return false
    end
    return true
end
