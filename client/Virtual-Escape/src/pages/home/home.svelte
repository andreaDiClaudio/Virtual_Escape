<script>
    import { user } from "../../stores/users/users.js";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Navbar from "../../components/Navbar.svelte";

    titleStore.setTitle("Home | VE");

    onMount(() => {
        document.body.classList.add("body-white");
    });

    // Reset the document title when the component is unmounted
    onDestroy(() => {
        titleStore.resetTitle();
        document.body.classList.remove("body-white");
    });
</script>

<Navbar />
<h1>Welcome, {$user.nickname}!</h1>
