-- Generated from fairino/source modules.
-- Variant: glue_j6_test
-- Generated: 20260524_235819
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
    -- Lin(point, speed, radius, position, offset_mode, x, y, z, rx, ry, rz)
    -- We test an orientation-only rz offset here as the first candidate for
    -- the 340-degree glue rotation. If the controller rejects this, we will
    -- switch to an explicit J6/MoveJ rotation test.
    Lin(P_PLACE, GLUE_ROTATION_SPEED, -1, 0, 1, 0, 0, 0, 0, 0, GLUE_ROTATION_ANGLE_DEG)
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
-- END station_glue.lua

-- BEGIN main_glue_test.lua
-- Explicit glue station test.
-- Expected:
-- 1. Move to stand-in glue point.
-- 2. Turn glue trigger on.
-- 3. Try a 340 degree orientation offset.
-- 4. Turn glue trigger off.
-- 5. Return home.

all_outputs_off()
set_running_lamps()

move_home()
glue_apply_j6_numeric_test()
move_home()

all_outputs_off()
set_ready_lamps()
-- END main_glue_test.lua

