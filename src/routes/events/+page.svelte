<script lang="ts">
    import EventCard from '$lib/components/EventCard.svelte';
    import type { EventsData } from '$lib/types';

    export let data: EventsData;

    // Group events by group name
    function groupEvents(events) {
        return events.reduce((acc, event) => {
            const groupName = event.GROUP.name;
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(event);
            return acc;
        }, {});
    }

    // Sort events within each group by starttime
    function sortGroupedEvents(groupedEvents) {
        for (const groupName in groupedEvents) {
            groupedEvents[groupName].sort((a, b) => new Date(a.starttime) - new Date(b.starttime));
        }
        return groupedEvents;
    }

    // Convert the grouped events object into an array for easier iteration
    function convertToSortedArray(groupedEvents) {
        return Object.keys(groupedEvents).sort().map(groupName => ({
            groupName,
            events: groupedEvents[groupName]
        }));
    }

    const groupedEvents = groupEvents(data.events);
    const sortedGroupedEvents = convertToSortedArray(sortGroupedEvents(groupedEvents));
</script>

<section class="py-5">
    <div class="container py-5">
        <div class="row mb-5">
            <div class="col-md-8 col-xl-6 col-xxl-5 text-center mx-auto">
                <h2 class="fw-bold">Upcoming Events</h2>
                <p class="text-muted" style="margin-left: 0px; padding-left: 0px; padding-right: 0px;">
                    Find out about the latest events from the Interest Groups and join them to learn and have fun
                </p>
            </div>
        </div>
        <div class="row row-cols-1 row-cols-md-2 mx-auto" style="max-width: 900px;">
            {#if sortedGroupedEvents.length}
                {#each sortedGroupedEvents as groupedEvent (groupedEvent.groupName)}
                    <div class="group-section">
                        <h3>{groupedEvent.groupName}</h3>
                        {#each groupedEvent.events as event (event.id)}
                            <EventCard {event} />
                        {/each}
                    </div>
                {/each}
            {:else}
                <p>No events available.</p>
            {/if}
        </div>
    </div>
</section>
