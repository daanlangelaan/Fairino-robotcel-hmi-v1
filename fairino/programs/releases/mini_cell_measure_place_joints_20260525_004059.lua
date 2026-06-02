-- Temporary simulator measurement.
-- Move to the stand-in glue/place point and hold so the Robot panel can be read.

SetDO(5, 0, 0, 0)
PTP(P_HOME, 20, -1, 0)
PTP(P_PLACE_APPROACH, 20, -1, 0)
Lin(P_PLACE, 20, -1, 0, 0)
SetDO(5, 1, 0, 0)
WaitMs(15000)
SetDO(5, 0, 0, 0)
