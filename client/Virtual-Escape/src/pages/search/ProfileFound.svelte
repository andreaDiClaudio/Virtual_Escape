<script>
    import Navbar from "../../components/Navbar.svelte";
    import ProfileFoundGallery from "./ProfileFoundGallery.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    onMount(() => {
        fetchUserData();
        document.getElementById("search-icon").style.color = "#e7793e";
    });

    //saves in a variable the user saved in localstorage
    const selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"));
    //Set the tabtitle to the username
    titleStore.setTitle(`@${selectedAccount.nickname} | VE`);

    /*FETCH SELECTED USER INFO*/
    function fetchUserData() {
        fetch("http://localhost:8080/api/users/" + selectedAccount.email, {
            method: "GET",
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    const user = result.data;

                    document
                        .getElementById("profile-image")
                        .setAttribute(
                            "src",
                            "http://localhost:8080/" + user.profile_img_url
                        );

                    updateUserInfoInput("user-info-nickname", user.nickname);
                    updateUserInfoInput("user-info-age", user.age);
                    updateUserInfoInput("user-info-country", user.country);
                    updateUserInfoInput("user-info-language", user.language);
                    updateUserInfoInput("user-info-gamertag", user.gamertag);
                    updateUserInfoInput("user-info-bio", user.bio);
                });
            }
        });
    }

    //helper function to update user info in the webpage
    function updateUserInfoInput(elementId, value) {
        const element = document.getElementById(elementId);
        //set the '@' in front of the username
        if (value !== null || value !== undefined) {
            if (elementId == "user-info-nickname") {
                // @ts-ignore
                element.value = "@" + value;
            } else {
                // @ts-ignore
                element.value = value;
            }
        } else {
            element.setAttribute("hidden", "true");
        }
    }
</script>

<Navbar />
<div id="profile-page">
    <div id="right-panel">
        <div id="user-info-wrapper">
            <div id="user-info-profile-image-wrapper">
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img id="profile-image" alt="Image Preview" />
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
                <input id="user-info-nickname" readonly disabled />
                <div id="extra-user-info-wrapper">
                    <input
                        id="user-info-gamertag"
                        value="Gamertag"
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-age"
                        value="Age"
                        min="1"
                        max="100"
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-country"
                        value="Country"
                        readonly
                        disabled
                    />
                    <input
                        id="user-info-language"
                        value="Languge"
                        readonly
                        disabled
                    />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea id="user-info-bio" readonly />
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
