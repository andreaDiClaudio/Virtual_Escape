<script>
    import Navbar from "../../components/Navbar.svelte";
    import ProfileFoundGallery from "./ProfileFoundGallery.svelte";
    import { onMount } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    let selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    let user = {};

    titleStore.setTitle(`@${selectedAccount.nickname} | VE`);

    onMount(async () => {
        await fetchUserData();
        document.getElementById("search-icon").style.color = "#e7793e";
    });

    async function fetchUserData() {
        try {
            const response = await fetch(
                "http://localhost:8080/api/users/" + selectedAccount.email,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 200) {
                const result = await response.json();
                user = result.data;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
</script>

<Navbar />
<div id="profile-page">
    <div id="right-panel">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            id="go-back-arrow"
            class="fas fa-angle-left"
            on:click={() => (window.location.href = "/search")}
        />
        <div id="user-info-wrapper">
            <div id="user-info-profile-image-wrapper">
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img
                    id="profile-image"
                    src={user.profile_img_url
                        ? `http://localhost:8080/${user.profile_img_url}`
                        : "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg"}
                    alt="Image Preview"
                />
                <div id="label-wrapper">
                    <label
                        for="profile-image-input"
                        id="label-image-upload-input"
                        hidden
                    >
                        Upload Image
                        <input
                            id="profile-image-input"
                            type="file"
                            name="file"
                            accept="image/*"
                            alt="Profile image"
                            disabled
                        />
                    </label>
                </div>
            </div>
            <div id="user-info-profile">
                <input
                    id="user-info-nickname"
                    value={`@${user.nickname}`}
                    readonly
                    disabled
                />
                <div id="extra-user-info-wrapper">
                    <input
                        id="user-info-gamertag"
                        value={user.gamertag}
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-age"
                        value={user.age}
                        min="1"
                        max="100"
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-country"
                        value={user.country}
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-language"
                        value={user.language}
                        readonly
                        disabled
                    />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea id="user-info-bio" value={user.bio} readonly />
                </div>
            </div>
        </div>
        <div id="hr-div">
            <hr id="horizontal-line" />
            <h4>Gallery</h4>
        </div>
        <ProfileFoundGallery />
    </div>
</div>
