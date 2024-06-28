// src/routes/events/+page.server.ts
import { supabase } from '$lib/supabaseClient';
import type { Event } from '$lib/types';

export async function load() {
    try {
        const { data: events, error } = await supabase
            .from('EVENT')
            .select(`
                id,
                name,
                description,
                starttime,
                location,
                group_id,
                endtime,
                GROUP (
                    name
                )
            `)
            .order('starttime', { ascending: true }); // Sort events chronologically

        if (error) {
            console.error('Error fetching events:', error);
            return {
                status: 500,
                error: new Error('Failed to fetch events'),
            };
        }

        return {
            events: events || []
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            status: 500,
            error: new Error('Unexpected error occurred'),
        };
    }
}
