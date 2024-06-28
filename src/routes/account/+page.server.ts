import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/');
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select(`username, full_name, website, avatar_url, role`)
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return {
            status: 500,
            error: 'Failed to fetch profile',
        };
    }

    return { session, profile };
};

export const actions: Actions = {
    update: async ({ request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData();
        const fullName = formData.get('fullName') as string;
        const username = formData.get('username') as string;
        const avatarUrl = formData.get('avatarUrl') as string;

        const { session } = await safeGetSession();

        const { error } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            full_name: fullName,
            username,
            avatar_url: avatarUrl,
            updated_at: new Date(),
        });

        if (error) {
            return fail(500, {
                fullName,
                username,
                avatarUrl,
            });
        }

        return {
            fullName,
            username,
            avatarUrl,
        };
    },
    assignRole: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const roleId = parseInt(formData.get('roleId') as string, 10);

        const { data, error } = await supabase
            .from('USER')
            .update({ role: roleId })
            .eq('email', email);

        if (error) {
            return fail(500, { error: 'Failed to assign role' });
        }

        return { success: true };
    },
    signout: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (session) {
            await supabase.auth.signOut();
            throw redirect(303, '/');
        }
    },
};
