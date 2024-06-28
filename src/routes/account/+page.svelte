<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

    export let data: {
        session: any;
        profile: {
            full_name: string;
            username: string;
            website: string;
            avatar_url: string;
            role: number;
        };
    };
    export let form: {
        fullName?: string;
        username?: string;
        website?: string;
    };

    let { session, profile } = data;
    $: ({ session, profile } = data);

    let profileForm: HTMLFormElement;
    let assignRoleForm: HTMLFormElement;
    let loading = false;
    let fullName: string = profile?.full_name ?? '';
    let username: string = profile?.username ?? '';
    let website: string = profile?.website ?? '';
    let avatarUrl: string = profile?.avatar_url ?? '';
    let role: number = profile?.role ?? 0;

    const handleSubmit: SubmitFunction = () => {
        loading = true;
        return async () => {
            loading = false;
        };
    };

    const handleSignOut: SubmitFunction = () => {
        loading = true;
        return async ({ update }) => {
            loading = false;
            update();
        };
    };
</script>

<style>
    .form-widget {
        max-width: 600px;
        margin: auto;
        padding: 2rem;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .form-widget label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
    .form-widget input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .form-widget button,
    .form-widget input[type="submit"] {
        width: 100%;
        padding: 0.75rem;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }
    .form-widget button:disabled,
    .form-widget input[type="submit"]:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
</style>

<div class="form-widget">
    <form
            class="form-widget"
            method="post"
            action="?/update"
            use:enhance={handleSubmit}
            bind:this={profileForm}
    >
        <div>
            <label for="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
        </div>

        <div>
            <label for="fullName">Full Name</label>
            <input id="fullName" name="fullName" type="text" value={form?.fullName ?? fullName} />
        </div>

        <div>
            <label for="username">Username</label>
            <input id="username" name="username" type="text" value={form?.username ?? username} />
        </div>

        <div>
            <label for="website">Website</label>
            <input id="website" name="website" type="url" value={form?.website ?? website} />
        </div>

        <div>
            <input
                    type="submit"
                    class="button block primary"
                    value={loading ? 'Loading...' : 'Update'}
                    disabled={loading}
            />
        </div>
    </form>


    <form method="post" action="?/signout" use:enhance={handleSignOut}>
        <div>
            <button class="button block" disabled={loading}>Sign Out</button>
        </div>
    </form>

    <div>
        <p>Role ID: {role}</p>
        {#if role === 0}
            <p>You're the best!</p>
        {/if}
    </div>
</div>
