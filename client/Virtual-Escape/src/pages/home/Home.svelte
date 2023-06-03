<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Navbar from "../../components/navbar/Navbar.svelte";
    import SuggestionCards from "./suggestion/SuggestionCards.svelte";
    import Feed from "./feed/Feed.svelte";

    /*Set tab title*/
    titleStore.setTitle("Home | VE");

    /*Set icon color and body color*/
    let bodyWhite = false;
    let homeIconColor = "";
    onMount(() => {
        bodyWhite = true;
        homeIconColor = "#e7793e";
    });

    /*Reset tabtitle*/
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
    <Feed />
</div>
