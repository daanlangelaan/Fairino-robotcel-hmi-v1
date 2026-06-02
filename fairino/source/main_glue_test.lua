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
