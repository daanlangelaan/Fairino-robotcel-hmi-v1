-- Minimal J6-only ServoJ test from known P_HOME joints.
-- Uses the verified P_HOME joint values from the project notes.
-- Expected: J6 ramps from 0 to about +120 deg and back; DO5 is on during test.

SetDO(5, 0, 0, 0)
PTP(P_HOME, 20, -1, 0)
WaitMs(500)

j1 = 0
j2 = -90
j3 = 90
j4 = -90
j5 = -90
base_j6 = 0

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
