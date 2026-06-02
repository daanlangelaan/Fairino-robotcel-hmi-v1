-- Minimal J6-only ServoJ test for Fairino simulator.
-- Goal: prove whether Lua ServoJ can visibly change J6 in the Robot status panel.
-- Expected: Robot moves to P_HOME, DO5 turns on, J6 ramps to about +120 deg,
-- pauses, then ramps back to the start value and DO5 turns off.

SetDO(5, 0, 0, 0)
PTP(P_HOME, 20, -1, 0)
WaitMs(500)

j1, j2, j3, j4, j5, j6 = GetActualJointPosDegree(1)
base_j6 = j6

SetDO(5, 1, 0, 0)
WaitMs(300)

for i = 1, 60 do
    ServoJ(j1, j2, j3, j4, j5, base_j6 + i * 2, 0, 0, 0.08, 0, 0)
end

WaitMs(1000)

for i = 60, 0, -1 do
    ServoJ(j1, j2, j3, j4, j5, base_j6 + i * 2, 0, 0, 0.08, 0, 0)
end

WaitMs(300)
SetDO(5, 0, 0, 0)
