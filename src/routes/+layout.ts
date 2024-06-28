import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

// Access environment variables using import.meta.env
const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    // Declare a dependency so the layout can be invalidated, for example, on session refresh.
    depends('supabase:auth');

    const supabase = isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                get(key) {
                    const cookie = parse(document.cookie);
                    return cookie[key];
                },
            },
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                get() {
                    return JSON.stringify(data.session);
                },
            },
        });

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    return { supabase, session, user };
};
