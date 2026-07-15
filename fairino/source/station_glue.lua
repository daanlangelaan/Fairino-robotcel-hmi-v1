-- Glue station logic.
-- Demo version uses A110/A120/A125/A130 points. Real cell keeps these names and
-- updates the taught coordinates.

function glue_move_approach()
    if motion_guard() == false then return false end
    PTP(A110_GLUE_APPROACH, GLUE_ROTATION_SPEED, -1, 0)
    return motion_guard()
end

function glue_move_contact()
    if motion_guard() == false then return false end
    Lin(A120_GLUE_START, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_move_rotation_end()
    if motion_guard() == false then return false end
    PTP(A125_GLUE_END, GLUE_ROTATION_SPEED, -1, 0)
    return motion_guard()
end

function glue_move_clear()
    if motion_guard() == false then return false end
    Lin(A130_GLUE_RETRACT, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_trigger_on()
    set_output(DO_GLUE_TRIGGER, true)
    -- Simulator-visible mirror. On real hardware we will remove this or map it
    -- to a spare lamp/output.
    set_output(DO_GLUE_TRIGGER_VISIBLE_SIM, true)
end

function glue_trigger_off()
    set_output(DO_GLUE_TRIGGER, false)
    set_output(DO_GLUE_TRIGGER_VISIBLE_SIM, false)
end

function glue_apply()
    if glue_move_approach() == false then return false end
    if glue_move_contact() == false then return false end

    glue_trigger_on()
    if guarded_wait(GLUE_START_DELAY_MS) == false then glue_trigger_off() return false end

    if glue_move_rotation_end() == false then glue_trigger_off() return false end

    glue_trigger_off()
    if guarded_wait(GLUE_TAIL_DELAY_MS) == false then return false end

    if glue_move_clear() == false then return false end
    return true
end
