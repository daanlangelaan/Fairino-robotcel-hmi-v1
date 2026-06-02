-- Finite one-cycle simulator POC flow.
-- This is the readable source version of mini_cell_poc_sim_once.lua.

all_outputs_off()
set_running_lamps()

move_home()
pick_filter_motion()
place_filter_motion()
move_home()

all_outputs_off()
set_ready_lamps()
