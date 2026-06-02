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
