<script>
    import Navbar from "../../components/Navbar.svelte";
    import UserGallery from "./ProfileGallery.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";
    import "toastr/build/toastr.min.css";
    import toastr from "toastr";

    // Set the tab title
    titleStore.setTitle("Profile | VE");

    // Reactive statement to update user icon color
    $: {
        if (document.getElementById("user-icon")) {
            document.getElementById("user-icon").style.color = "#e7793e";
        }
    }

    onMount(() => {
        fetchUserData();
    });

    onDestroy(() => {
        titleStore.resetTitle();
    });
    let isEditing = false;
    let previewImageSrc = "";
    let profileImgUrl;
    let selectedFile;
    let ageValue;
    let countryValue;
    let languageValue;
    let gamertagValue;
    let bioValue;

    function toggleEditMode() {
        isEditing = !isEditing;
    }

    // Fetch user info
    async function fetchUserData() {
        const response = await fetch(
            "http://localhost:8080/api/users/" + $user.email,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (response.status == 200) {
            const result = await response.json();
            const fetchedUser = result.data;

            // Set the reactive variables with the fetched user data
            ageValue = fetchedUser.age;
            countryValue = fetchedUser.country;
            languageValue = fetchedUser.language;
            gamertagValue = fetchedUser.gamertag;
            bioValue = fetchedUser.bio;

            if (fetchedUser.profile_img_url == null) {
                profileImgUrl =
                    "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg";
            } else {
                let relativeUrl = "";
                if (
                    fetchedUser.profile_img_url.includes(
                        "http://localhost:8080/"
                    )
                ) {
                    relativeUrl = fetchedUser.profile_img_url.replace(
                        "http://localhost:8080/",
                        ""
                    );
                    profileImgUrl = "http://localhost:8080/" + relativeUrl;
                } else {
                    profileImgUrl =
                        "http://localhost:8080/" + fetchedUser.profile_img_url;
                }
            }
        }
    }

    function previewImage(event) {
        const file = event.target.files[0];
        selectedFile = file;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                previewImageSrc = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    /*SAVE*/
    function saveChanges() {
        // Fetch the user information from the API
        fetch("http://localhost:8080/api/users/" + $user.email, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then((result) => {
                if (result) {
                    const userFound = result.data;

                    const formData = new FormData();
                    // Append the file and other data to the form data
                    formData.append("file", selectedFile);
                    formData.append("description", "");
                    formData.append("game", "");
                    formData.append("is_profile_img", "1");

                    // Check if there's a file to upload
                    if (!selectedFile) {
                        // Update user information without uploading a new image
                        updateUser(userFound, userFound.profile_img_url);
                    } else {
                        /*POST IMAGE*/
                        // Upload the image and update user information
                        fetch("http://localhost:8080/api/images", {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                        })
                            .then((response) => {
                                if (response.status == 200) {
                                    return response.json();
                                }
                            })
                            .then((data) => {
                                if (data) {
                                    /*PATCH*/
                                    updateUser(userFound, data.imagePath);
                                }
                            });
                    }
                }
            });
    }

    function updateUser(userFound, imagePath) {
        // Send a PATCH request to update the user information and profile image
        return fetch("http://localhost:8080/api/users/" + userFound.email, {
            method: "PATCH",
            body: JSON.stringify({
                gamertag: gamertagValue,
                bio: bioValue,
                age: ageValue,
                country: countryValue,
                language: languageValue,
                profile_img_url: imagePath,
            }),
            credentials: "include",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            // Check the response status
            if (response.status === 400) {
                toastr.options = {
                    closeButton: false,
                    debug: false,
                    newestOnTop: false,
                    progressBar: false,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                    onclick: null,
                    hideDuration: 500,
                    timeOut: 3000,
                    extendedTimeOut: 1000,
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    showDuration: 300,
                };
                toastr["error"]("Wrong input. Please enter the age as number");
                // Add a reactive variable to handle the border style
                let ageBorderStyle = "solid 2px red";
            } else if (response.status === 200) {
                // Redirect to the profile page
                window.location.href = "/profile";
            }
        });
    }

    /*DISCARD CHANGES*/
    function discardChanges() {
        window.location.href = "/profile";
    }
</script>

<!--*PAGE*-->
<Navbar />

<div id="profile-page">
    <div id="right-panel">
        <div id="user-info-wrapper">
            <div id="user-info-profile-image-wrapper">
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img
                    id="profile-image"
                    alt="Image Preview"
                    src={previewImageSrc || profileImgUrl}
                />
                <div id="label-wrapper">
                    <label
                        for="profile-image-input"
                        class="button"
                        id="label-image-upload-input"
                        hidden={!isEditing}
                    >
                        Upload Image
                        <input
                            id="profile-image-input"
                            type="file"
                            name="file"
                            accept="image/*"
                            alt="Profile image"
                            on:change={previewImage}
                            disabled={!isEditing}
                            hidden={!isEditing}
                        />
                    </label>
                </div>
            </div>
            <div id="user-info-profile">
                <input
                    id="user-info-nickname"
                    value="@{$user.nickname}"
                    disabled
                />
                <div id="extra-user-info-wrapper">
                    <input
                        id="user-info-gamertag"
                        readonly={!isEditing}
                        disabled={!isEditing}
                        placeholder={!isEditing ? "" : "gamertag"}
                        bind:value={gamertagValue}
                    />
                    <input
                        id="user-info-age"
                        min="1"
                        max="100"
                        readonly={!isEditing}
                        disabled={!isEditing}
                        placeholder={!isEditing ? "" : "age"}
                        bind:value={ageValue}
                    />
                    <input
                        id="user-info-country"
                        bind:value={countryValue}
                        readonly={!isEditing}
                        disabled={!isEditing}
                        placeholder={!isEditing ? "" : "country"}
                    />
                    <input
                        id="user-info-language"
                        bind:value={languageValue}
                        readonly={!isEditing}
                        disabled={!isEditing}
                        placeholder={!isEditing ? "" : "language"}
                    />
                </div>
                <div id="user-info-bio-wrapper">
                    <textarea
                        id="user-info-bio"
                        bind:value={bioValue}
                        readonly={!isEditing}
                        disabled={!isEditing}
                        placeholder={!isEditing ? "" : "bio"}
                    />
                </div>
            </div>
            <div id="user-info-edit-button-wrapper">
                <div>
                    <button class="button" on:click={toggleEditMode}
                        >Edit</button
                    >
                </div>
                <div id="user-info-edit-confirm-wrapper" hidden={!isEditing}>
                    <button class="button" on:click={discardChanges}>
                        Discard
                    </button>
                    <button class="button" on:click={saveChanges}>Save</button>
                </div>
            </div>
        </div>
        <div id="hr-div">
            <hr id="horizontal-line" />
            <h4>Gallery</h4>
        </div>
        <UserGallery />
    </div>
</div>
