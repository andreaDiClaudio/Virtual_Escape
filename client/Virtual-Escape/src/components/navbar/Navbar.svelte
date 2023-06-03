<script>
    import NavbarSettingsPopup from "./NavbarSettingsPopup.svelte";

    /*Variables declaration for binding values*/
    export let homeIconColor = "";
    export let userIconColor = "";
    export let uploadIconColor = "";
    export let searchIconColor = "";
    export let bestGameIconColor = "";

    let isSettings = false;

    function showSettingsPopup() {
        isSettings = true;
    }
</script>

<nav id="navbar">
    <div id="navbar-left-side">
        <!-- svelte-ignore a11y-missing-content -->
        <a
            class="fas fa-home"
            id="home-icon"
            href="/home"
            style="color: {homeIconColor};"
        />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a
            class="fas fa-upload"
            id="upload-icon"
            href="/upload"
            style="color: {uploadIconColor};"
        />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a
            class="fas fa-search"
            id="search-icon"
            href="/search"
            style="color: {searchIconColor};"
        />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a
            class="fas fa-user"
            id="user-icon"
            href="/profile"
            style="color: {userIconColor};"
        />
        <p>|</p>
        <!-- svelte-ignore a11y-missing-content -->
        <a
            class="fas fa-share"
            id="best-game-icon"
            href="/bestgame"
            style="color: {bestGameIconColor};"
        />
    </div>
    <div id="navbar-mid">
        <img
            alt="VE logo"
            src="http://localhost:8080/public/logo/justLogo.png"
            id="VE-logo"
        />
    </div>
    <div id="navbar-right-side">
        <button on:click={showSettingsPopup} class="fas fa-cog" id="button" />
    </div>
</nav>
{#if isSettings}
    <NavbarSettingsPopup />
{/if}
