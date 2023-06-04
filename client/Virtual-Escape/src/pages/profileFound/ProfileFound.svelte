<script>
    import Navbar from "../../components/navbar/Navbar.svelte";
    import ProfileFoundGallery from "./ProfileFoundGallery.svelte";
    import { onMount } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { navigate } from "svelte-navigator";

    /*Variables for binding values*/
    let selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    let user = {};
    let searchIconColor = "";

    /*Set tabtitle*/
    titleStore.setTitle(`@${selectedAccount.nickname} | VE`);

    /*Fetches the user data and seta icon color*/
    onMount(() => {
        fetch("http://localhost:8080/api/users/" + selectedAccount.email, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                user = data.data;
            });

        searchIconColor = "#e7793e";
    });
</script>

<Navbar {searchIconColor} />
<div id="profile-page">
    <div id="right-panel">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            id="go-back-arrow"
            class="fas fa-angle-left"
            on:click={() => navigate("/search")}
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
