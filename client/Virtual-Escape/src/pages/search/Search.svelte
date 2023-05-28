<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Navbar from "../../components/Navbar.svelte";

    titleStore.setTitle("Search | VE");
</script>

<Navbar />
