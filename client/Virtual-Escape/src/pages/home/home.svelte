<script>
    import { user } from "../../stores/users/users.js";

    import { onMount, onDestroy } from "svelte";
    onMount(() => {
        document.title = "Home | VE";
        return onDestroy(() => {
            document.title = "Virtual Escape";
        });
    });

    function handleSubmit() {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                user.set(null);
                localStorage.removeItem("user");
                window.location.href = "/";
            }
        });
    }
</script>

<div id="page">
    <h1>Welcome, {$user.nickname}!</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <button type="submit" id="submit-form-button">logout</button>
    </form>
</div>
