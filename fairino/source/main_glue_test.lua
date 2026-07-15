-- Explicit glue station point-table test.
-- Expected:
-- 1. Move through A110_GLUE_APPROACH and A120_GLUE_START.
-- 2. Turn glue trigger on.
-- 3. Move to taught A125_GLUE_END.
-- 4. Turn glue trigger off.
-- 5. Retract to A130_GLUE_RETRACT.

all_outputs_off()
set_running_lamps()

move_home()
glue_apply()

all_outputs_off()
set_ready_lamps()
