<script>
    import { user } from "../../stores/users/users.js";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Navbar from "../../components/Navbar.svelte";
    import SuggestionCards from "../../assets/css/home/suggestion/SuggestionCards.svelte";

    /*Set tab title*/
    titleStore.setTitle("Home | VE");

    let bodyWhite = false;
    let homeIconColor = "";

    onMount(() => {
        bodyWhite = true;
        homeIconColor = "#e7793e";
    });

    onDestroy(() => {
        titleStore.resetTitle();
        bodyWhite = false;
    });
</script>

<svelte:head>
    {#if bodyWhite}
        <style>
            body {
                background-color: white;
            }
        </style>
    {/if}
</svelte:head>

<Navbar {homeIconColor} />
<div id="home-page">
    <SuggestionCards />
</div>
