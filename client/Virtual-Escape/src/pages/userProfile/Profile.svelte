<script>
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";
    import "toastr/build/toastr.min.css";
    import toastr from "toastr";

    /*Components*/
    import Navbar from "../../components/navbar/Navbar.svelte";
    import UserGallery from "./gallery/ProfileGallery.svelte";
    import ProfileUserInfoInputs from "./ProfileUserInfoInputs.svelte";
    import ProfileUserEditButtons from "./ProfileUserEditButtons.svelte";

    /*Set Tab Title*/
    titleStore.setTitle("Profile | VE");

    /*Updates user icon and fetches user data*/
    let userIconColor = "";
    onMount(() => {
        userIconColor = "#e7793e";
        fetchUserData();
    });

    /*Resets tabtitle*/
    onDestroy(() => {
        titleStore.resetTitle();
    });

    /*Variables for binding values*/
    let isEditing = false;
    let previewImageSrc;
    let profileImgUrl = "";
    let selectedFile;
    let countryValue;
    let languageValue;
    let gamertagValue;
    let bioValue;
    let ageValue;

    /*variables id*/
    let ageId = "user-info-age";
    let countryId = "user-info-country";
    let languageId = "user-info-language";
    let gamertagId = "user-info-gamertag";
    let bioId = "user-info-bio";
    let descriptionId;

    /*Activate edit mode: shows buttons and inputs (changes also styling)*/
    function toggleEditMode() {
        isEditing = true;

        ageId = "user-info-age-edit";
        countryId = "user-info-country-edit";
        languageId = "user-info-language-edit";
        gamertagId = "user-info-gamertag-edit";
        bioId = "user-info-bio-edit";
        descriptionId = "popup-window-description";
    }

    /*Fetch user info*/
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

            // Set the default profile image
            if (fetchedUser.profile_img_url == null) {
                profileImgUrl =
                    "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg";
            } else {
                // Ensure the profile image URL starts with "http://localhost:8080/"
                if (
                    !fetchedUser.profile_img_url.startsWith(
                        "http://localhost:8080/"
                    )
                ) {
                    profileImgUrl =
                        "http://localhost:8080/" + fetchedUser.profile_img_url;
                } else {
                    profileImgUrl = fetchedUser.profile_img_url;
                }
            }
        }
    }

    /*Handles the profile image preview when loaded*/
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

    /*Save button triggered*/
    //reads the profile image, if new, will post it and then call the updateUser().if not new, will grab the old profile image path and call the updateUser()
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

                    if (!selectedFile) {
                        // Update user information without uploading a new image
                        updateUser(userFound, userFound.profile_img_url);
                    } else {
                        /*Upload the image and update user information*/
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

    /*Patch user info*/
    //actually peforms the patch request
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
            } else if (response.status === 200) {
                // Redirect to the profile page
                window.location.href = "/profile";
            }
        });
    }

    /*Discard changes*/
    function discardChanges() {
        window.location.href = "/profile";
    }
</script>

<Navbar {userIconColor} />
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
            <ProfileUserInfoInputs
                bind:isEditing
                bind:gamertagValue
                bind:ageValue
                bind:countryValue
                bind:languageValue
                bind:bioValue
                bind:gamertagId
                bind:ageId
                bind:countryId
                bind:languageId
                bind:bioId
                {user}
            />
            <ProfileUserEditButtons
                bind:isEditing
                on:toggleEditMode={toggleEditMode}
                on:discardChanges={discardChanges}
                on:saveChanges={saveChanges}
            />
        </div>
        <div id="hr-div">
            <hr id="horizontal-line" />
            <h4>Gallery</h4>
        </div>
        <UserGallery />
    </div>
</div>
