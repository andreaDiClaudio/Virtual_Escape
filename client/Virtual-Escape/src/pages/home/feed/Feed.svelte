<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import FeedPopup from "../feedPopup/FeedPopup.svelte";

    /*fetches all images*/
    let images;
    let shuffledImages = [];
    onMount(() => {
        fetch("http://localhost:8080/api/images/", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                images = data.data;
                shuffledImages = shuffleArray(images);
            });
    });

    /*Declaration for binding values*/
    let feedPopupVisible = false;
    let feedPopupImageSrc = "";
    let feedPopupImage = {};
    let feedPopupUser = {};

    /*To shuffle the images*/
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /*Get user who posted the picture*/
    function getUser(imgSrc, image) {
        fetch("http://localhost:8080/api/users/" + image.user_email, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                feedPopupUser = data.data;
                showFeedPopup(imgSrc, image);
            });
    }

    /*Shows popup*/
    function showFeedPopup(imageSrc, image) {
        feedPopupVisible = true;
        feedPopupImageSrc = imageSrc;
        feedPopupImage = image;
    }

    /*Closes Popup*/
    function closeFeedPopup() {
        feedPopupVisible = false;
    }
</script>

<div id="hr-div">
    <hr id="horizontal-line" />
    <h1 id="feed-title">Discover</h1>
    <FeedPopup
        bind:user={feedPopupUser}
        bind:isVisible={feedPopupVisible}
        bind:imageSrc={feedPopupImageSrc}
        bind:image={feedPopupImage}
        on:close={closeFeedPopup}
    />
    <div id="feed">
        {#each shuffledImages as image}
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
                    getUser(`http://localhost:8080/${image.image_url}`, image)}
            >
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img
                    class="user-gallery-image"
                    src={`http://localhost:8080/${image.image_url}`}
                    alt="User gallery image"
                />
                <div
                    class="user-gallery-opacity-layer"
                    style="display: none;"
                />
                <img
                    class="user-gallery-zoom-in-icon"
                    src="http://localhost:8080/public/webIcons/zoom-icon-white.png"
                    alt="Zoom icon"
                    hidden
                />
            </div>
        {/each}
    </div>
</div>
