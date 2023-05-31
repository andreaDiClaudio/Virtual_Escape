<script>
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    const dispatch = createEventDispatcher();

    /*Variables for binding values*/
    export let isVisible = false;
    export let imageSrc = "";
    export let image = {};
    export let user = {};

    /*Close popup*/
    function closePopup() {
        isVisible = false;
        dispatch("close");
    }
</script>

{#if isVisible}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="background-overlay" on:click={closePopup} />
    <div id="popup-window" style="display: flex;">
        <div id="popup-window-image-preview-wrapper">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img id="popup-window-image-preview" src={imageSrc} />
        </div>
        <div id="popup-window-image-info">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                id="popup-window-user-wrapper"
                on:click={() => {
                    localStorage.setItem(
                        "selectedAccount",
                        JSON.stringify(user)
                    );
                    navigate(`/search/@${user.nickname}`);
                }}
            >
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <div id="popup-window-user-profile-image-wrapper">
                    <img
                        id="popup-window-user-profile-image"
                        alt="user profile image"
                        src="http://localhost:8080/{user.profile_img_url}"
                    />
                </div>
                <h3 id="popup-window-user-nickname">@{user.nickname}</h3>
            </div>
            {#if image.description}
                <div id="popup-window-image-description">
                    <h3>Description:</h3>
                    <p id="description-text">{image.description}</p>
                </div>
            {/if}
            {#if image.game}
                <div id="user-profile-image-game">
                    <h3 style="padding-top: 2rem;">Game:</h3>
                    <p id="game-text">{image.game}</p>
                </div>
            {/if}
        </div>
    </div>
{/if}
