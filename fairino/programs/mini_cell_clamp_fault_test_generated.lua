-- Generated from fairino/source modules.
-- Explicit clamp fault test.
-- Upload this file to the Fairino simulator/controller.

-- BEGIN config.lua
-- Shared constants for the Fairino mini-cell POC.

-- States
S00_INIT = 0
S20_WAIT_READY = 20
S30_WAIT_START = 30
S60_PICK_FILTER = 60
S80_CLAMP_FILTER = 80
S180_CYCLE_COMPLETE = 180
S900_FAULT = 900
S910_WAIT_RESET = 910
S990_SAFETY_STOP = 990

-- Faults
FAULT_NONE = 0
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

-- Parameters
GRIPPER_CLOSE_TIME_MS = 300
CLAMP_SETTLE_TIME_MS = 300
INPUT_POLL_MS = 50
PICK_SENSOR_TIMEOUT_MS = 3000
GRIPPER_SENSOR_TIMEOUT_MS = 3000
CLAMP_SENSOR_TIMEOUT_MS = 3000
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

-- BEGIN station_clamp.lua
-- Clamp station logic for the simulator POC.
-- In the current simulator this still uses P_PLACE_* as stand-in clamp points.
-- Later these names become real clamp station points.

function clamp_place_filter()
    place_filter_motion()
end

function clamp_place_and_verify()
    clamp_place_filter()

    if wait_sim_input("clamp_closed", CLAMP_SENSOR_TIMEOUT_MS) == false then
        raise_fault(F006_CLAMP_NOT_CLOSED)
        return false
    end

    SetDO(DO_DEBUG_CLAMP_OK, 1, 0, 0)
    return true
end
-- END station_clamp.lua

-- BEGIN main_clamp_fault_test.lua
-- Explicit clamp fault test.
-- Expected result:
-- 1. Pick and place at the stand-in clamp position.
-- 2. Turn clamp output on.
-- 3. Force red fault lamp without accepting clamp OK.

all_outputs_off()
set_running_lamps()

move_home()
pick_filter_motion()
place_filter_motion()

WaitMs(1000)
SetDO(DO_LAMP_RED, 1, 0, 0)
SetDO(DO_DEBUG_CLAMP_OK, 0, 0, 0)
WaitMs(2000)
-- END main_clamp_fault_test.lua

