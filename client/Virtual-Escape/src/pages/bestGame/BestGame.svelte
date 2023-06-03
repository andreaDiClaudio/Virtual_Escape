<script>
    import Navbar from "../../components/navbar/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import io from "socket.io-client";

    /*Set tab title*/
    titleStore.setTitle("Best Game | VE");

    /*Set icon color*/
    let bestGameIconColor = "";
    onMount(() => {
        bestGameIconColor = "#e7793e";
    });

    /*Sends user opinion*/
    const socket = io("http://localhost:8080");
    let userOpinion = "";

    const user = JSON.parse(sessionStorage.getItem("user"));
    function handleSubmitOpinion() {
        socket.emit("submit opinion", {
            username: user.nickname,
            opinion: userOpinion,
        });
    }

    /*saves the opinion in a list*/
    let opinionsList = [];
    socket.on("update opinions", (data) => {
        opinionsList = data;
    });
</script>

<Navbar {bestGameIconColor} />
<div id="best-game-page">
    <div id="best-game-page-left-side">
        <p id="best-game-page-title">Best Game<br /> Ever ?</p>
        <p id="best-game-page-description">
            Share <b class="bold">your opinion</b> with other virtual photogrpahers!
        </p>
        <div id="best-game-page-form-wrapper">
            <div id="best-game-page-input">
                <input
                    maxlength="28"
                    placeholder="Say it here!"
                    class="best-game-page-input"
                    type="text"
                    bind:value={userOpinion}
                />
            </div>
            <div id="best-game-page-button-wrapper">
                <button class="button" on:click={handleSubmitOpinion}
                    >Submit Opinion</button
                >
            </div>
        </div>
    </div>

    <div id="best-game-page-right-side">
        <div id="best-game-panel">
            <ul>
                {#each opinionsList as opinion}
                    <li>
                        <span id="best-game-user-nickname"
                            >{opinion.user_nickname}:</span
                        >
                        <span id="best-game-user-opinion"
                            >{opinion.user_opinion}</span
                        >
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
