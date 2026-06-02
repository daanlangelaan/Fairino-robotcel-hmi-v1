-- Fairino mini-cell simulator POC: finite one-cycle version.
-- Use this first if the simulator refuses to start the endless state-machine.
-- It uses only the teaching points already proven in the earlier pick/place test.

DO_GRIPPER_CLOSE = 0
DO_CLAMP_CLOSE = 1
DO_LAMP_GREEN = 2
DO_LAMP_ORANGE = 3
DO_LAMP_RED = 4

function all_outputs_off()
    SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
    SetDO(DO_CLAMP_CLOSE, 0, 0, 0)
    SetDO(DO_LAMP_GREEN, 0, 0, 0)
    SetDO(DO_LAMP_ORANGE, 0, 0, 0)
    SetDO(DO_LAMP_RED, 0, 0, 0)
end

all_outputs_off()
SetDO(DO_LAMP_GREEN, 1, 0, 0)

PTP(P_HOME, 20, -1, 0)

PTP(P_PICK_APPROACH, 20, -1, 0)
Lin(P_PICK, 20, -1, 0, 0)
SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
WaitMs(300)
Lin(P_PICK_APPROACH, 20, -1, 0, 0)

PTP(P_PLACE_APPROACH, 20, -1, 0)
Lin(P_PLACE, 20, -1, 0, 0)
SetDO(DO_GRIPPER_CLOSE, 0, 0, 0)
SetDO(DO_CLAMP_CLOSE, 1, 0, 0)
WaitMs(300)
Lin(P_PLACE_APPROACH, 20, -1, 0, 0)

PTP(P_HOME, 20, -1, 0)

all_outputs_off()
SetDO(DO_LAMP_ORANGE, 1, 0, 0)
