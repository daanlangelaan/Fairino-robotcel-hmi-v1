-- Ultra-slow real-robot probe for the keerklep pick section.
-- If line 5 fails here too, the point itself/configuration must be re-taught.

PTP(A070_CLAMP_RETRACT, 1, -1, 0)
WaitMs(2500)

PTP(A080_VALVE_PICK_APPROACH, 1, -1, 0)
WaitMs(2500)

Lin(A090_VALVE_PICK, 1, -1, 0, 0)
WaitMs(2500)

Lin(A100_VALVE_LIFT, 1, -1, 0, 0)
WaitMs(2500)
