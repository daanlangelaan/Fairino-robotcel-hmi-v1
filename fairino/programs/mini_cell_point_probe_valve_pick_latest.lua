-- Minimal real-robot probe for the keerklep pick section.
-- Run only at very low override and with the cell clear.
-- This isolates which point causes a controller-level joint command point error.

PTP(A070_CLAMP_RETRACT, 5, -1, 0)
WaitMs(2000)

PTP(A080_VALVE_PICK_APPROACH, 5, -1, 0)
WaitMs(2000)

Lin(A090_VALVE_PICK, 3, -1, 0, 0)
WaitMs(2000)

Lin(A100_VALVE_LIFT, 3, -1, 0, 0)
WaitMs(2000)
