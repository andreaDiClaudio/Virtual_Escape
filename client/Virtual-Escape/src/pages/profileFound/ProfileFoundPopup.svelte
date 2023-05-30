<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    /*Variables for binding values*/
    export let isVisible = false;
    export let imageSrc = "";
    export let image = {};

    function closePopup() {
        isVisible = false;
        dispatch("close");
    }
</script>

{#if isVisible}
    <div id="background-overlay" on:click={closePopup} />
    <div id="popup-window" style="display: flex;">
        <div id="popup-window-image-preview-wrapper">
            <img id="popup-window-image-preview" src={imageSrc} />
        </div>
        <div id="popup-window-image-info">
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
