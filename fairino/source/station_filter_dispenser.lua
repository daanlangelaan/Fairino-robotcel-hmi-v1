-- Filter dispenser skeleton for the next expansion step.
-- For now this models one simulated dispenser. Later this becomes 1..8.

filter_dispense_attempts = 0
filter_dispenser_empty = 0
active_filter_dispenser = 1

function filter_dispenser_has_filter_ready()
    return sim_input("filter_present")
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

    if filter_dispenser_has_filter_ready() then
        return true
    end

    while filter_dispense_attempts < MAX_FILTER_DISPENSE_RETRIES do
        -- Later: robot presses dispenser lever here.
        filter_dispense_attempts = filter_dispense_attempts + 1

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
