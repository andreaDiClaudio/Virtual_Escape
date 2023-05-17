<script>
    import { user } from "../../stores/users/users.js";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    // Update the document title when the component is mounted
    titleStore.setTitle("Home | VE");

    // Reset the document title when the component is unmounted
    onDestroy(() => {
        titleStore.resetTitle();
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

<div id="home-page">
    <nav>
        <div id="navbar">
            <div id="navbar-left-side">
                <a class="navbar-content">Home</a>
                <a class="navbar-content">Create</a>
                <a class="navbar-content">Profile</a>
            </div>

            <form on:submit|preventDefault={handleSubmit}>
                <button type="submit" id="submit-form-button">logout</button>
            </form>
        </div>
    </nav>
    <h1>Welcome, {$user.nickname}!</h1>
</div>
