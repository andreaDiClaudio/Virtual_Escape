<script>
    import { onMount, onDestroy } from "svelte";
    import ProfilePopupWindow from "../popupWindow/ProfilePopupWindow.svelte";

    onMount(() => {
        fetchUserImages();
    });

    let user = JSON.parse(localStorage.getItem("user"));
    /*Variables for binding values*/
    let userImages = [];
    let userImagesReverse = [];
    let isPopupVisible = false;
    let popupImageSrc = "";
    let popupImageData = { description: "", game: "" };
    let isDropdownVisible = false;
    let isEditing = false;
    let descriptionInputValue = "";
    let gameInputValue = "";
    let descriptionId = "";

    /*Fetch user images*/
    //fetches user uploaded images to fill the gallery
    function fetchUserImages() {
        fetch("http://localhost:8080/api/search/images/" + user.email, {
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
                userImagesReverse = userImages.reverse();
            })
            .catch((error) => {
                console.error("Error fetching user images:", error);
            });
    }

    function showPopup(imageSrc, image) {
        isPopupVisible = true;
        popupImageSrc = imageSrc;
        popupImageData = image;
    }
</script>

<div id="user-gallery-wrapper">
    {#each userImagesReverse as image}
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
<ProfilePopupWindow
    bind:isEditing
    bind:gameInputValue
    bind:popupImageData
    bind:descriptionInputValue
    bind:isDropdownVisible
    bind:isPopupVisible
    bind:popupImageSrc
/>
