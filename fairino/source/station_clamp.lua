-- Clamp, press, and drying-row station helpers for the simulator POC.

function clamp_close_and_verify()
    set_output(DO_CLAMP_CLOSE, true)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_process_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end
    set_debug_output("clamp_ok", true)
    return true
end

function clamp_open_and_verify()
    set_output(DO_CLAMP_CLOSE, false)
    if guarded_wait(CLAMP_SETTLE_TIME_MS) == false then
        return false
    end
    set_debug_output("clamp_ok", false)
    return true
end

function press_check_valve_and_verify()
    set_output(DO_CHECK_VALVE_PRESS, true)
    if guarded_wait(CHECK_VALVE_PRESS_TIME_MS) == false then
        set_output(DO_CHECK_VALVE_PRESS, false)
        return false
    end
    set_output(DO_CHECK_VALVE_PRESS, false)
    if guarded_wait(PRESS_SETTLE_TIME_MS) == false then
        return false
    end
    if wait_process_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F012_CHECK_VALVE_NOT_INSERTED)
        return false
    end
    return true
end
