-- Minimal real-robot point probe.
-- Purpose: isolate whether A010_HOME or A020_FILTER_PICK_APPROACH causes
-- "[Error] Joint command point error".

PTP(A010_HOME, 5, -1, 0)
WaitMs(1500)

PTP(A020_FILTER_PICK_APPROACH, 5, -1, 0)
WaitMs(1500)
