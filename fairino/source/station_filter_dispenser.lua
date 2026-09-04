-- Mechanical zig-zag filter dispenser.
-- For now this controls one dispenser. Later this becomes 1..8.

filter_dispense_attempts = 0
filter_dispenser_empty = 0
active_filter_dispenser = 1

function filter_dispenser_reset()
    filter_dispense_attempts = 0
    filter_dispenser_empty = 0
end

function filter_dispenser_has_filter_ready()
    return process_input("filter_present")
end

function filter_dispenser_select()
    if filter_dispenser_empty == 1 then
        return false
    end

    return true
end

function filter_dispenser_prepare_pick()
    filter_dispense_attempts = 0

    if filter_dispenser_select() == false then
        return false
    end

    while filter_dispense_attempts < MAX_FILTER_DISPENSE_RETRIES do
        if dispense_filter_motion() == false then
            return false
        end

        filter_dispense_attempts = filter_dispense_attempts + 1

        if guarded_wait(FILTER_DISPENSE_SETTLE_TIME_MS) == false then
            return false
        end

        if filter_dispenser_has_filter_ready() then
            return true
        end
    end

    filter_dispenser_empty = 1
    return false
end

function check_valve_dispenser_prepare_pick()
    set_output(DO_CHECK_VALVE_FEED, true)
    if guarded_wait(CHECK_VALVE_FEED_SETTLE_TIME_MS) == false then
        set_output(DO_CHECK_VALVE_FEED, false)
        return false
    end
    return true
end
