-- Explicit gripper fault test.
-- Expected result:
-- 1. Go home.
-- 2. Move to pick.
-- 3. Close gripper.
-- 4. Wait briefly.
-- 5. Set red fault lamp DO4.
-- 6. Stop without moving to place.

all_outputs_off()
set_running_lamps()

move_home()

PTP(P_PICK_APPROACH, 20, -1, 0)
Lin(P_PICK, 20, -1, 0, 0)
SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
WaitMs(1000)
Lin(P_PICK_APPROACH, 20, -1, 0, 0)

all_outputs_off()
SetDO(DO_GRIPPER_CLOSE, 1, 0, 0)
SetDO(DO_LAMP_RED, 1, 0, 0)
WaitMs(2000)
