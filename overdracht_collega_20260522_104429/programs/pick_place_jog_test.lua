-- Minimal pick/place playback test for the FAIRINO simulator.
-- This first test intentionally uses only PTP moves.
-- Goal: verify program loading and playback before refining LIN approach moves.

PTP(P_HOME,20,-1,0)
PTP(P_PICK,20,-1,0)
WaitMs(300)
PTP(P_PLACE,20,-1,0)
WaitMs(300)
PTP(P_HOME,20,-1,0)
