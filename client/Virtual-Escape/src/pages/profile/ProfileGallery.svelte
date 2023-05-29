<script>
    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        fetchUserImages();
    });

    let userImages = [];
    let isPopupVisible = false;
    let popupImageSrc = "";
    let popupImageData = { description: "", game: "" };
    let isDropdownVisible = false;
    let isEditing = false;
    let descriptionInputValue = "";
    let gameInputValue = "";

    /*FETCH USER IMAGES*/
    //fetches user uploaded images to fill the gallery
    function fetchUserImages() {
        fetch("http://localhost:8080/api/images", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then((res) => {
                // Set the userImages reactive variable with the fetched images
                userImages = res.data;
            })
            .catch((error) => {
                console.error("Error fetching user images:", error);
            });
    }

    async function saveChanges(image) {
        const response = await fetch(
            "http://localhost:8080/api/images/" + image.id,
            {
                method: "PATCH",
                body: JSON.stringify({
                    description: descriptionInputValue,
                    game: gameInputValue,
                }),
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
        );

        if (response.status === 404) {
            // Your toastr logic
        } else if (response.status === 200) {
            window.location.href = "/profile";
        }
    }

    function showPopup(imageSrc, image) {
        isPopupVisible = true;
        popupImageSrc = imageSrc;
        popupImageData = image;
    }

    function closePopup() {
        isPopupVisible = false;
    }

    function editPopup(image) {
        isEditing = true;
        descriptionInputValue = image.description;
        gameInputValue = image.game;
    }

    function deleteImage(image) {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        return fetch("http://localhost:8080/api/images/" + image.id, {
            method: "DELETE",
            credentials: "include",
        }).then((response) => {
            if (response.status === 200) {
                window.location.href = "/profile";
            }
        });
    }

    function toggleDropdown() {
        isDropdownVisible = !isDropdownVisible;
    }

    function discardChanges() {
        isEditing = false;
    }
</script>

<div id="user-gallery-wrapper">
    {#each userImages as image}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div
            class="user-gallery-card"
            on:mouseover={() => {
                image.showZoomIcon = true;
                image.showOpacityLayer = true;
            }}
            on:mouseout={() => {
                image.showZoomIcon = false;
                image.showOpacityLayer = false;
            }}
            on:click={() =>
                showPopup(`http://localhost:8080/${image.image_url}`, image)}
        >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src="http://localhost:8080/{image.image_url}"
                class="user-gallery-image"
            />
            <div
                class="user-gallery-opacity-layer"
                style="display: {image.showOpacityLayer ? 'block' : 'none'}"
            />
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src="http://localhost:8080/public/webIcons/zoom-icon-white.png"
                class="user-gallery-zoom-in-icon"
                hidden={!image.showZoomIcon}
            />
        </div>
    {/each}
</div>
{#if isPopupVisible}
    <div id="background-overlay" on:click={closePopup} />
    <div id="popup-window" style="display: flex;">
        <div id="popup-window-image-preview-wrapper">
            <img id="popup-window-image-preview" src={popupImageSrc} />
        </div>

        <div id="popup-window-image-info">
            {#if isEditing}
                <div id="popup-window-image-description">
                    <h3>Description:</h3>
                    <input type="text" bind:value={descriptionInputValue} />
                </div>
                <div id="user-profile-image-game">
                    <h3 style="padding-top: 2rem;">Game:</h3>
                    <input type="text" bind:value={gameInputValue} />
                </div>
                <div id="image-info-edit-confirm-wrapper">
                    <button class="button" on:click={discardChanges}
                        >Discard</button
                    >
                    <button
                        class="button"
                        on:click={() => saveChanges(popupImageData)}
                        >Save</button
                    >
                </div>
            {:else}
                {#if popupImageData.description}
                    <div id="popup-window-image-description">
                        <h3>Description:</h3>
                        <p id="description-text">
                            {popupImageData.description}
                        </p>
                    </div>
                {/if}
                {#if popupImageData.game}
                    <div id="user-profile-image-game">
                        <h3 style="padding-top: 2rem;">Game:</h3>
                        <p id="game-text">{popupImageData.game}</p>
                    </div>
                {/if}
                <!-- Option Button Wrapper -->
                <div
                    id="popup-window-option-button-wrapper"
                    class="popup-window-option-button-wrapper"
                >
                    <button
                        class="popup-window-option-button"
                        on:click={toggleDropdown}>•••</button
                    >

                    <!-- Dropdown Menu -->
                    {#if isDropdownVisible}
                        <div class="dropdown-menu">
                            <!-- Edit Button -->
                            <button
                                class="dropdown-item"
                                on:click={() => editPopup(popupImageData)}
                            >
                                <i
                                    class="fas fa-pen"
                                    style="padding-left: 0.5rem;"
                                />
                            </button>

                            <!-- Delete Button -->
                            <button
                                class="dropdown-item"
                                on:click={() => deleteImage(popupImageData)}
                            >
                                <i
                                    class="fas fa-trash"
                                    style="padding-left: 0.5rem;"
                                />
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}
