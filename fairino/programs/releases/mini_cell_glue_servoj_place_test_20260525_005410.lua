-- Generated from fairino/source modules.
-- Variant: glue_servoj_place_test
-- Generated: 20260525_005410
-- Glue/J6 test build.
-- Upload this uniquely named file to avoid Fairino WebApp cache/name confusion.

-- BEGIN config.lua
-- Shared constants for the Fairino mini-cell POC.

-- States
S00_INIT = 0
S20_WAIT_READY = 20
S30_WAIT_START = 30
S40_SELECT_FILTER_DISPENSER = 40
S50_DISPENSE_FILTER = 50
S60_PICK_FILTER = 60
S80_CLAMP_FILTER = 80
S180_CYCLE_COMPLETE = 180
S900_FAULT = 900
S910_WAIT_RESET = 910
S990_SAFETY_STOP = 990

-- Faults
FAULT_NONE = 0
F001_FILTER_NOT_AVAILABLE = 1
F003_FILTER_NOT_PICKED = 3
F006_CLAMP_NOT_CLOSED = 6
F990_SAFETY_STOP = 990

-- Outputs
DO_GRIPPER_CLOSE = 0
DO_CLAMP_CLOSE = 1
DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4
DO_DEBUG_CLAMP_OK = 5
DO_DEBUG_PICK_OK = 6
DO_DEBUG_PLACE_ENTERED = 7
DO_GLUE_TRIGGER = 8
DO_GLUE_TRIGGER_VISIBLE_SIM = 5

-- Parameters
MAX_FILTER_DISPENSE_RETRIES = 2
GRIPPER_CLOSE_TIME_MS = 300
CLAMP_SETTLE_TIME_MS = 300
INPUT_POLL_MS = 50
PICK_SENSOR_TIMEOUT_MS = 3000
GRIPPER_SENSOR_TIMEOUT_MS = 3000
CLAMP_SENSOR_TIMEOUT_MS = 3000
GLUE_START_DELAY_MS = 300
GLUE_TAIL_DELAY_MS = 300
GLUE_ROTATION_ANGLE_DEG = 340
GLUE_ROTATION_SPEED = 20
GLUE_SERVOJ_TEST_ANGLE_DEG = 120
GLUE_SERVOJ_CYCLE_MS = 80
-- END config.lua

-- BEGIN io_sim.lua
-- Simulator IO helpers.
-- Replace these later with real GetDI/SetDO helpers or register-based HMI IO.

SIM_SAFETY_OK = 1
SIM_START_BUTTON = 1
SIM_RESET_BUTTON = 0
SIM_FILTER_PRESENT = 1
SIM_GRIPPER_FILTER_PRESENT = 1
SIM_CLAMP_CLOSED = 1

function all_outputs_off()
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 0, 0, 0)
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
    SetDO(DO_DEBUG_PICK_OK, 0, 0, 0)
    SetDO(DO_DEBUG_PLACE_ENTERED, 0, 0, 0)
    SetDO(DO_DEBUG_CLAMP_OK, 0, 0, 0)
    SetDO(DO_GLUE_TRIGGER, 0, 0, 0)
end

function set_ready_lamps()
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 1, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
end

function set_running_lamps()
    SetDO(DO_LAMP_GREEN, 1, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
end

function set_fault_lamps()
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 1, 0, 0)
end

function sim_input(name)
    if name == "safety_ok" then return SIM_SAFETY_OK == 1 end
    if name == "start" then return SIM_START_BUTTON == 1 end
    if name == "reset" then return SIM_RESET_BUTTON == 1 end
    if name == "filter_present" then return SIM_FILTER_PRESENT == 1 end
    if name == "gripper_filter_present" then return SIM_GRIPPER_FILTER_PRESENT == 1 end
    if name == "clamp_closed" then return SIM_CLAMP_CLOSED == 1 end
    return false
end
-- END io_sim.lua

-- BEGIN motion.lua
-- Robot movement routines for the mini-cell POC.
-- These use the existing simulator teaching points from the earlier pick/place test.

function move_home()
    PTP(P_HOME, 20, -1, 0)
end

function pick_filter_motion()
    PTP(P_PICK_APPROACH, 20, -1, 0)
    Lin(P_PICK, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
    WaitMs(GRIPPER_CLOSE_TIME_MS)
    Lin(P_PICK_APPROACH, 20, -1, 0, 0)
end

function place_filter_motion()
    PTP(P_PLACE_APPROACH, 20, -1, 0)
    Lin(P_PLACE, 20, -1, 0, 0)
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
    WaitMs(CLAMP_SETTLE_TIME_MS)
    Lin(P_PLACE_APPROACH, 20, -1, 0, 0)
end
-- END motion.lua

-- BEGIN station_glue.lua
-- Glue station logic.
-- First simulator version uses existing place points as stand-in glue points.
-- Real cell will get P_GLUE_APPROACH, P_GLUE_CONTACT and P_GLUE_CLEAR.

function glue_move_approach()
    -- Stand-in point for simulator-only test.
    PTP(P_PLACE_APPROACH, GLUE_ROTATION_SPEED, -1, 0)
end

function glue_move_contact()
    -- Stand-in point for simulator-only test.
    Lin(P_PLACE, GLUE_ROTATION_SPEED, -1, 0, 0)
end

function glue_move_clear()
    -- Stand-in point for simulator-only test.
    Lin(P_PLACE_APPROACH, GLUE_ROTATION_SPEED, -1, 0, 0)
end

function glue_rotate_wrist_placeholder()
    -- Fairino supports motion offsets in generated Lin commands:
    -- Lin(point, speed, radius, choice, type, offset, x, y, z, rx, ry, rz)
    -- The webapp field allows up to 300 degrees for drz, so we first test a
    -- visible 300-degree orientation offset. The final process can use a
    -- taught 340-degree endpoint or a split motion if this works.
    Lin(P_PLACE, GLUE_ROTATION_SPEED, -1, 0, 0, 1, 0, 0, 0, 0, 0, 300)
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
    glue_move_approach()
    glue_move_contact()

    glue_trigger_on()
    WaitMs(GLUE_START_DELAY_MS)

    glue_rotate_wrist_placeholder()

    glue_trigger_off()
    WaitMs(GLUE_TAIL_DELAY_MS)

    glue_move_clear()
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
end
-- END station_glue.lua

-- BEGIN main_glue_test.lua
-- Explicit glue station J6 test.
-- Expected:
-- 1. Move to temporary glue/contact point.
-- 2. Turn glue trigger on.
-- 3. Rotate J6 with the proven ServoJ ramp.
-- 4. Hold the rotated pose so the Robot panel can be checked.
-- 5. Turn glue trigger off and leave J6 at the test angle.

all_outputs_off()
set_running_lamps()

move_home()
glue_apply_servoj_place_test()

all_outputs_off()
set_ready_lamps()
-- END main_glue_test.lua

