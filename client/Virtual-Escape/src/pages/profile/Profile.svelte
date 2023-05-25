<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";
    import "toastr/build/toastr.min.css";
    import toastr from "toastr";

    titleStore.setTitle("Profile | VE");

    //Retrieve user info from db and displaythem
    onMount(() => {
        fetchUserData();
        fetchUserImages();
    });

    onDestroy(() => {
        titleStore.resetTitle();
    });

    /*LOAD USER INFO*/
    //helper function to update user info in the webpage
    function updateUserInfoInput(elementId, value) {
        const element = document.getElementById(elementId);
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

    function fetchUserData() {
        fetch(
            "http://localhost:8080/api/users?nickname=" +
                $user.nickname +
                "&email=" +
                $user.email,
            {
                method: "GET",
            }
        ).then((response) => {
            if (response.status == 200) {
                response.json().then((result) => {
                    const user = result.data[0];

                    if (user.profile_img_url == null) {
                        document
                            .getElementById("profile-image")
                            .setAttribute(
                                "src",
                                "http://localhost:8080/public/defaultUserProfileImage/1684737647624-181908121___default_profile_image.jpg"
                            );
                    } else {
                        let relativeUrl = "";
                        if (
                            user.profile_img_url.includes(
                                "http://localhost:8080/"
                            )
                        ) {
                            relativeUrl = user.profile_img_url.replace(
                                "http://localhost:8080/",
                                ""
                            );
                            document
                                .getElementById("profile-image")
                                .setAttribute(
                                    "src",
                                    "http://localhost:8080/" + relativeUrl
                                );
                        } else {
                            document
                                .getElementById("profile-image")
                                .setAttribute(
                                    "src",
                                    "http://localhost:8080/" +
                                        user.profile_img_url
                                );
                        }
                    }

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
                // Access the data array
                const data = res.data;

                // Get the container where you want to append the new div elements
                const container = document.getElementById(
                    "user-gallery-wrapper"
                );

                data.forEach((image) => {
                    // Create a new div element
                    const div = document.createElement("div");
                    div.className = "user-gallery-card";

                    // Create a new img element
                    const img = document.createElement("img");
                    img.src = "http://localhost:8080/" + image.image_url;
                    img.className = "user-gallery-image";

                    // Add the img element to the div
                    div.appendChild(img);

                    // Add the div element to the container
                    container.appendChild(div);

                    console.log(image.image_url);
                });
            })
            .catch((error) => {
                console.error("Error fetching user images:", error);
            });
    }

    /*EDIT*/
    function previewImage(event) {
        // Get the image input from the event target
        const imageInput = event.target;

        // Check if there are files and if the first file is an image
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            // Set the onload function for the reader
            reader.onload = (e) => {
                // @ts-ignore
                // Set the preview source to the result of the file read
                document
                    .getElementById("profile-image")
                    .setAttribute("src", e.target.result.toString());
            };

            // Read the image file as a data URL
            reader.readAsDataURL(imageInput.files[0]);
        }
    }

    //shows buttons and modifies input to be not readonly
    function editUserInfo() {
        // Define an array of input element ids
        const inputIds = [
            "user-info-gamertag",
            "user-info-age",
            "user-info-country",
            "user-info-language",
            "user-info-bio",
        ];

        // Loop through the inputIds array and apply changes to each element
        inputIds.forEach((id) => {
            const inputElement = document.getElementById(id);
            inputElement.className = "user-info-input";
            inputElement.removeAttribute("readonly");
            inputElement.removeAttribute("disabled");

            //split the ids and takes the last part to se it as placeholder
            const idSplitted = id.split("-");
            inputElement.setAttribute("placeholder", idSplitted[2]);

            // Add specific styles and attributes for the "user-info-age" element
            if (id === "user-info-age") {
                inputElement.style.width = "2rem";
            }
        });

        // Show the editConfirmWrapper element
        document
            .getElementById("user-info-edit-confirm-wrapper")
            .removeAttribute("hidden");

        //Show the profile image input
        document
            .getElementById("profile-image-input")
            .removeAttribute("hidden");
        document
            .getElementById("profile-image-input")
            .removeAttribute("disabled");
        document
            .getElementById("label-image-upload-input")
            .removeAttribute("hidden");
    }

    /*SAVE CHANGES*/
    // Function to update user information and profile image
    function updateUser(userFound, imagePath) {
        // Get user information elements
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const gamertag = document.getElementById("user-info-gamertag");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );

        // Send a PATCH request to update the user information and profile image
        return fetch("http://localhost:8080/api/users/" + userFound.id, {
            method: "PATCH",
            body: JSON.stringify({
                // @ts-ignore
                gamertag: gamertag.value,
                // @ts-ignore
                bio: bio.value,
                // @ts-ignore
                age: age.value,
                // @ts-ignore
                country: country.value,
                // @ts-ignore
                language: language.value,
                profile_img_url: imagePath,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            // Check the response status
            if (response.status === 400) {
                let message = "Wrong credentials";

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

                age.style.border = "solid 2px red";
            } else if (response.status === 200) {
                // Reset input styling and attributes
                [gamertag, age, country, language, bio].forEach((element) => {
                    element.className = "";
                    element.setAttribute("readonly", "true");
                    element.setAttribute("disabled", "true");
                });

                // Hide the edit confirmation wrapper
                editConfirmWrapper.setAttribute("hidden", "true");
                // Redirect to the profile page
                window.location.href = "/profile";
            }
        });
    }

    // Function to save changes made to the user profile
    function saveChanges() {
        // Fetch the user information from the API
        fetch(
            "http://localhost:8080/api/users?nickname=" +
                $user.nickname +
                "&email=" +
                $user.email,
            {
                method: "GET",
            }
        )
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
            })
            .then((result) => {
                if (result) {
                    const userFound = result.data[0];
                    const imageInput = document.getElementById(
                        "profile-image-input"
                    );
                    // @ts-ignore
                    const file = imageInput.files[0];
                    const formData = new FormData();

                    // Append the file and other data to the form data
                    formData.append("file", file);
                    formData.append("description", "");
                    formData.append("game", "");
                    formData.append("is_profile_img", "1");

                    // Check if there's a file to upload
                    if (!file) {
                        const oldImageUrl =
                            // @ts-ignore
                            document.getElementById("profile-image").src;
                        // Update user information without uploading a new image
                        updateUser(userFound, oldImageUrl);
                    } else {
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
                                    updateUser(userFound, data.imagePath);
                                }
                            });
                    }
                }
            });
    }

    /*DISCARD CHANGES*/
    function discardChanges() {
        const inputIds = [
            "user-info-gamertag",
            "user-info-age",
            "user-info-country",
            "user-info-language",
            "user-info-bio",
        ];

        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );
        // Set inputs to readonly
        inputIds.forEach((id) => {
            document.getElementById(id).setAttribute("readonly", "true");
        });
        editConfirmWrapper.setAttribute("hidden", "true");
        // Refresh the page
        window.location.href = "/profile";
    }
</script>

<!--*PAGE*-->
<Navbar />
<div id="profile-page">
    <!--TODO implement later
    <div id="left-panel">
        <h2>Folders</h2>
        <p>1. Horizon Forbidden West</p>
        <p>1. A very long title of a none existing gam, but just in case</p>
    </div>
    -->
    <div id="right-panel">
        <div id="user-info-wrapper">
            <div id="user-info-profile-image">
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
                            hidden
                            on:change={previewImage}
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
            <div id="user-info-edit-button-wrapper">
                <div>
                    <button
                        class="user-info-update-buttons"
                        on:click={editUserInfo}>Edit</button
                    >
                </div>
                <div id="user-info-edit-confirm-wrapper" hidden>
                    <button
                        class="user-info-update-buttons"
                        on:click={discardChanges}>Discard</button
                    >
                    <button
                        class="user-info-update-buttons"
                        on:click={saveChanges}>Save</button
                    >
                </div>
            </div>
        </div>
        <div id="user-gallery-wrapper" />
    </div>
</div>
