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
        <!-- svelte-ignore a11y-missing-content -->
        <a class="fas fa-home" id="home-icon" href="/home" />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a class="fas fa-upload" id="upload-icon" href="/upload" />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a class="fas fa-user" id="user-icon" href="/profile" />
        <p>|</p>
        <a class="fas fa-search" id="search-icon" href="/search" />
    </div>
    <div id="navbar-mid">
        <img
            alt="VE logo"
            src="http://localhost:8080/public/logo/justLogo.png"
            id="VE-logo"
        />
    </div>
    <div id="navbar-right-side">
        <form on:submit|preventDefault={handleSubmit}>
            <button type="submit" class="fas fa-sign-out" id="button" />
        </form>
    </div>
</nav>
