<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    onMount(() => {
        const { data: authData } = supabase.auth.onAuthStateChange((event, _Session) => {
            if (_Session) {
                // Queue this as a task so the navigation won't prevent the triggering function from completing
                setTimeout(() => {
                    goto('/', { invalidateAll: false });
                });
            } else {
                invalidate('supabase:auth');
            }
        });

        // Ensure we correctly handle the subscription
        const subscription = authData?.subscription;

        return () => subscription?.unsubscribe();
    });
</script>

<svelte:head>
    <title>OSCO</title>
</svelte:head>

<div class="container" style="padding: 50px 0 100px 0">
    <slot />
</div>
