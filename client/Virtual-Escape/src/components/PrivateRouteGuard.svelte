<script>
    import { onMount } from "svelte";
    import { useNavigate, useLocation } from "svelte-navigator";
    import { user } from "../stores/users/users.js";

    const navigate = useNavigate();
    const location = useLocation();

    onMount(() => {
        if (!$user || $user == undefined) {
            navigate("/", {
                state: { from: $location.pathname },
                replace: true,
            });
        }
    });
</script>

{#if $user}
    <slot />
{/if}
