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
    Lin(A125_GLUE_END, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_move_clear()
    if motion_guard() == false then return false end
    Lin(A130_GLUE_RETRACT, GLUE_ROTATION_SPEED, -1, 0, 0)
    return motion_guard()
end

function glue_rotate_wrist_placeholder()
    -- Fairino supports motion offsets in generated Lin commands:
    -- Lin(point, speed, radius, choice, type, offset, x, y, z, rx, ry, rz)
    -- The webapp field allows up to 300 degrees for drz, so we first test a
    -- visible 300-degree orientation offset. The final process can use a
    -- taught 340-degree endpoint or a split motion if this works.
    Lin(A120_GLUE_START, GLUE_ROTATION_SPEED, -1, 0, 0, 1, 0, 0, 0, 0, 0, 300)
end

function glue_trigger_on()
    SetDO(DO_GLUE_TRIGGER, 1, 0, 0)
    -- Simulator-visible mirror. On real hardware we will remove this or map it
    -- to a spare lamp/output.
    SetDO(DO_GLUE_TRIGGER_VISIBLE_SIM, 1, 0, 0)
end

function glue_trigger_off()
    SetDO(DO_GLUE_TRIGGER, 0, 0, 0)
    SetDO(DO_GLUE_TRIGGER_VISIBLE_SIM, 0, 0, 0)
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

function glue_apply_j6_numeric_test()
    -- Numeric candidate for visible wrist rotation.
    -- Based on the previously working explicit MoveJ P_PLACE pose.
    -- We step J6/RZ in chunks to make the rotation visible and avoid one huge jump.
    local speed = GLUE_ROTATION_SPEED
    local acc = 180
    local ovl = 30

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,7.379,-330.321,-615.766,224.583,89.273,-7.370,-38.311,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,127.379,-330.321,-615.766,224.583,89.273,-7.370,81.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
    MoveJ(50.975,-56.614,84.472,-28.579,89.379,247.379,-330.321,-615.766,224.583,89.273,-7.370,201.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
    MoveJ(50.975,-56.614,84.472,-28.579,89.379,347.379,-330.321,-615.766,224.583,89.273,-7.370,301.689,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    MoveJ(50.975,-56.614,84.472,-28.579,89.379,7.379,-330.321,-615.766,224.583,89.273,-7.370,-38.311,0,0,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
end

function glue_apply_offset_test()
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_placeholder()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    glue_move_clear()
end

function glue_rotate_wrist_servoj_home_test()
    -- Proven in the Fairino simulator: ServoJ changes J6 and Robot panel data.
    -- This home-position test isolates the wrist rotation before we bind it to
    -- a real taught glue point.
    local j1 = 0
    local j2 = -90
    local j3 = 90
    local j4 = -90
    local j5 = -90
    local base_j6 = 0
    local target = GLUE_SERVOJ_TEST_ANGLE_DEG
    local cycle_s = GLUE_SERVOJ_CYCLE_MS / 1000
    local i = 0

    while i <= target do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + i, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end

    i = 1
    while i <= 125 do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + target, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end
end

function glue_apply_servoj_home_test()
    move_home()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_servoj_home_test()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)
end

function glue_rotate_wrist_servoj_place_test()
    -- Temporary simulator glue point based on measured P_PLACE joint values.
    local j1 = 21.799
    local j2 = -101.415
    local j3 = 126.681
    local j4 = -115.266
    local j5 = -90
    local base_j6 = 21.799
    local target = GLUE_SERVOJ_TEST_ANGLE_DEG
    local cycle_s = GLUE_SERVOJ_CYCLE_MS / 1000
    local i = 0

    while i <= target do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + i, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end

    i = 1
    while i <= 125 do
        ServoJ(j1, j2, j3, j4, j5, base_j6 + target, 0, 0, cycle_s, 0, 0)
        WaitMs(GLUE_SERVOJ_CYCLE_MS)
        i = i + 1
    end
end

function glue_apply_servoj_place_test()
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_servoj_place_test()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)
    glue_move_clear()
end
