-- Slow J6 ServoJ hold test.
-- Expected: starting from P_HOME, J6 slowly ramps from 0 to +120 deg.
-- It then holds the commanded J6 position for 10 seconds with DO5 on.
-- This test intentionally does not return J6 to 0, so the Robot panel can be checked.

SetDO(5, 0, 0, 0)
PTP(P_HOME, 20, -1, 0)
WaitMs(1000)

j1 = 0
j2 = -90
j3 = 90
j4 = -90
j5 = -90
base_j6 = 0

SetDO(5, 1, 0, 0)

for i = 1, 120 do
    ServoJ(j1, j2, j3, j4, j5, base_j6 + i, 0, 0, 0.08, 0, 0)
    WaitMs(80)
end

for i = 1, 125 do
    ServoJ(j1, j2, j3, j4, j5, base_j6 + 120, 0, 0, 0.08, 0, 0)
    WaitMs(80)
end

-- Leave DO5 on as an end marker for this diagnostic test.
