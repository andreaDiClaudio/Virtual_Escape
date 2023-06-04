<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { navigate } from "svelte-navigator";

    /*Set tab title*/
    titleStore.setTitle("Goodbye | VE");

    /*Sets the color of the body of the page*/
    let bodyGradient = false;
    /*Countdown*/
    let remainingTimeValue;
    onMount(() => {
        bodyGradient = true;

        let secondsLeft = 10;
        setInterval(() => {
            remainingTimeValue = secondsLeft;
            secondsLeft -= 1;
        }, 900);
    });

    /*reset tabtitle*/
    onDestroy(() => {
        titleStore.resetTitle();
        bodyGradient = false;
    });

    /*button to redirect*/
    function handleRedirection() {
        navigate("/signup");
    }

    /*Timeout for redirecting*/
    setTimeout(() => navigate("/signup"), 10000);
</script>

<svelte:head>
    {#if bodyGradient}
        <style>
            body {
                background-image: linear-gradient(55deg, #f4dfc5, #e7793e);
            }
        </style>
    {/if}
</svelte:head>

<div id="goodbye-page">
    <div id="goodbye-card-wrapper">
        <div id="goodbye-window">
            <div id="title-wrapper">
                <h1 id="title">Goodbye</h1>
                <div id="paragraph-wrapper">
                    <p>We are really sad to see you leave...</p>
                    <p>
                        but we want to thank you to have joined our community.
                        Take care!
                    </p>
                </div>
                <button class="button" on:click={handleRedirection}
                    >To the signup page</button
                >
            </div>
            <p id="automatic-redirection-timer">
                You will be automatically ridericted to the signup in: {remainingTimeValue ||
                    10}
            </p>
        </div>
    </div>
</div>
