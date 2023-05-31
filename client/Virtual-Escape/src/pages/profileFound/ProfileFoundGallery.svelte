<script>
    // @ts-nocheck

    import ProfileFoundPopup from "./ProfileFoundPopup.svelte";
    import { onMount } from "svelte";

    /*Variables for binding values*/
    let selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    let userImages = [];
    let profileFoundPopupVisible = false;
    let profileFoundPopupImageSrc = "";
    let profileFoundPopupImage = {};

    /*Fetch user images*/
    onMount(async () => {
        await fetchUserImages();
    });

    /*Fetch user found images*/
    async function fetchUserImages() {
        try {
            const response = await fetch(
                "http://localhost:8080/api/search/images/" +
                    selectedAccount.email,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 200) {
                const res = await response.json();
                userImages = res.data;
            }
        } catch (error) {
            console.error("Error fetching user images:", error);
        }
    }

    /*Shows popup*/
    function showProfileFoundPopup(imageSrc, image) {
        profileFoundPopupVisible = true;
        profileFoundPopupImageSrc = imageSrc;
        profileFoundPopupImage = image;
    }

    /*Close popup*/
    function closeProfileFoundPopup() {
        profileFoundPopupVisible = false;
    }
</script>

<ProfileFoundPopup
    bind:isVisible={profileFoundPopupVisible}
    bind:imageSrc={profileFoundPopupImageSrc}
    bind:image={profileFoundPopupImage}
    on:close={closeProfileFoundPopup}
/>
<div id="user-gallery-wrapper">
    {#each userImages as image}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div
            class="user-gallery-card"
            on:mouseover={(e) => {
                e.currentTarget.children[1].style.display = "block";
                e.currentTarget.children[2].hidden = false;
            }}
            on:mouseout={(e) => {
                e.currentTarget.children[1].style.display = "none";
                e.currentTarget.children[2].hidden = true;
            }}
            on:click={() =>
                showProfileFoundPopup(
                    `http://localhost:8080/${image.image_url}`,
                    image
                )}
        >
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
                class="user-gallery-image"
                src={`http://localhost:8080/${image.image_url}`}
                alt="User gallery image"
            />
            <div class="user-gallery-opacity-layer" style="display: none;" />
            <img
                class="user-gallery-zoom-in-icon"
                src="http://localhost:8080/public/webIcons/zoom-icon-white.png"
                alt="Zoom icon"
                hidden
            />
        </div>
    {/each}
</div>
