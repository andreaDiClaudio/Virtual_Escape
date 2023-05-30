<script>
    import Navbar from "../../components/Navbar.svelte";
    import bestGames from "../../stores/bestGame/bestGame";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import io from "socket.io-client";

    /*Set tab title*/
    titleStore.setTitle("Home | VE");

    let bestGameIconColor = "";
    onMount(() => {
        bestGameIconColor = "#e7793e";
    });

    const socket = io("http://localhost:8080");
    let userOpinion = "";

    const user = JSON.parse(sessionStorage.getItem("user"));
    function handleSubmitOpinion() {
        socket.emit("submit opinion", {
            username: user.nickname,
            opinion: userOpinion,
        });
    }

    let opinionsList = [];

    socket.on("update opinions", (data) => {
        opinionsList = data;
    });
</script>

<Navbar {bestGameIconColor} />
<input type="text" bind:value={userOpinion} />
<button on:click={handleSubmitOpinion}>Submit Opinion</button>

<ul>
    {#each opinionsList as opinion}
        <li>{opinion.user_nickname}: {opinion.user_opinion}</li>
    {/each}
</ul>
