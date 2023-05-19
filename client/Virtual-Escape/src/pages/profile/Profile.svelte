<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    titleStore.setTitle("Profile | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });
</script>

<Navbar />

<div id="profile-page">
    <div id="left-panel">
        <h2>Folders</h2>
        <p>1. Horizon Forbidden West</p>
        <p>1. A very long title of a none existing gam, but just in case</p>
    </div>
    <div id="right-panel">
        <p>Profile section</p>
    </div>
</div>
