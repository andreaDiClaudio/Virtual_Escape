<script>
    import { user } from "../stores/users/users.js";

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

<nav id="navbar">
    <div id="navbar-left-side">
        <a class="navbar-content" href="/home">Home</a>
        <p>|</p>
        <a class="navbar-content" href="/upload">Upload</a>
        <p>|</p>
        <a class="navbar-content" href="/profile">Profile</a>
    </div>
    <div id="navbar-right-side">
        <form on:submit|preventDefault={handleSubmit}>
            <button type="submit" id="logout-button">logout</button>
        </form>
    </div>
</nav>
