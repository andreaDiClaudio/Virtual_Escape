<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import { user } from "../../stores/users/users.js";

    titleStore.setTitle("Profile | VE");

    onDestroy(() => {
        titleStore.resetTitle();
    });

    /**USER INFO SECTION**/
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

    /*LOAD USER INFO*/
    //Retrieve user info from db and displaythem
    onMount(() => {
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

                    console.log(user);

                    if (user.profile_img_url == null) {
                        document
                            .getElementById("profile-image")
                            .setAttribute(
                                "src",
                                "http://localhost:8080/public/uploadedImages/1684737647624-181908121___default_profile_image.jpg"
                            );
                    } else {
                        let relativeUrl = "";
                        if (
                            user.profile_img_url.includes(
                                "http://localhost:8080/"
                            )
                        ) {
                            console.log(user.profile_img_url);

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
    });

    /*EDIT*/
    function previewImage(event) {
        const imageInputButton = document.getElementById("profile-image-input");

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
    }

    /*SAVE CHANGES*/
    function saveChanges() {
        //save attributes
        const age = document.getElementById("user-info-age");
        const country = document.getElementById("user-info-country");
        const language = document.getElementById("user-info-language");
        const gamertag = document.getElementById("user-info-gamertag");
        const bio = document.getElementById("user-info-bio");
        const editConfirmWrapper = document.getElementById(
            "user-info-edit-confirm-wrapper"
        );
        const editPorfilePictureButton = document.getElementById(
            "edit-profile-image-button"
        );

        /***************************/
        /*GET*/
        //Retrieve user logged in in the db and saves it in a variable
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
                    const userFound = result.data[0];
                    /***************************/

                    console.log(userFound);

                    /***************************/
                    /*POST*/
                    //Upload the profile image
                    const imageInput = document.getElementById(
                        "profile-image-input"
                    );

                    // @ts-ignore
                    const file = imageInput.files[0];
                    const formData = new FormData();

                    formData.append("file", file);
                    formData.append("description", "");
                    formData.append("game", "");

                    //Working
                    if (!file) {
                        console.log("picture not updated");
                        console.log(
                            // @ts-ignore
                            document.getElementById("profile-image").src
                        );
                        // @ts-ignore
                        const oldImageUrl =
                            document.getElementById("profile-image").src;
                        /*PATCH without uploading the image*/
                        fetch(
                            "http://localhost:8080/api/users/" + userFound.id,
                            {
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
                                    profile_img_url: oldImageUrl,
                                }),
                                headers: {
                                    "Content-type":
                                        "application/json; charset=UTF-8",
                                },
                            }
                        ).then((response) => {
                            if (response.status === 400) {
                                //TODO implement toaster for the message
                                console.log(
                                    "Wrong input. please enter the age as number"
                                );
                            } else if (response.status === 200) {
                                // Reset input styling and attributes
                                [gamertag, age, country, language, bio].forEach(
                                    (element) => {
                                        element.className = "";
                                        element.setAttribute(
                                            "readonly",
                                            "true"
                                        );
                                        element.setAttribute(
                                            "disabled",
                                            "true"
                                        );
                                    }
                                );

                                editConfirmWrapper.setAttribute(
                                    "hidden",
                                    "true"
                                );

                                //window.location.href = "/profile";
                            }
                        });
                    } else {
                        fetch("http://localhost:8080/api/images", {
                            method: "POST",
                            body: formData,
                            credentials: "include",
                        })
                            .then((response) => {
                                if (response.status == 200) {
                                    return response.json(); // Return the JSON promise
                                }
                            })
                            .then((data) => {
                                if (data) {
                                    console.log(data.imagePath); // Extract the imagePath value from the JSON data

                                    /***************************/
                                    /*PATCH*/
                                    fetch(
                                        "http://localhost:8080/api/users/" +
                                            userFound.id,
                                        {
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
                                                profile_img_url: data.imagePath,
                                            }),
                                            headers: {
                                                "Content-type":
                                                    "application/json; charset=UTF-8",
                                            },
                                        }
                                    ).then((response) => {
                                        if (response.status === 400) {
                                            //TODO implement toaster for the message
                                            console.log(
                                                "Wrong input. please enter the age as number"
                                            );
                                        } else if (response.status === 200) {
                                            // Reset input styling and attributes
                                            [
                                                gamertag,
                                                age,
                                                country,
                                                language,
                                                bio,
                                            ].forEach((element) => {
                                                element.className = "";
                                                element.setAttribute(
                                                    "readonly",
                                                    "true"
                                                );
                                                element.setAttribute(
                                                    "disabled",
                                                    "true"
                                                );
                                            });

                                            editConfirmWrapper.setAttribute(
                                                "hidden",
                                                "true"
                                            );

                                            //window.location.href = "/profile";
                                        }
                                    });
                                }
                            });
                    }
                });
                /***************************/
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

    //TODO Retreive photos and create the whole gallery section
</script>

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
                <div id="user-info-edit-button">
                    <button on:click={editUserInfo}>Edit</button>
                </div>
                <div id="user-info-edit-confirm-wrapper" hidden>
                    <button on:click={discardChanges}>discard</button>
                    <button on:click={saveChanges}>save</button>
                </div>
            </div>
        </div>
        <div id="user-gallery-wrapper">
            <div class="user-gallery-card">
                <p>Working</p>
            </div>
            <div class="user-gallery-card">
                <p>Working</p>
            </div>
            <div class="user-gallery-card">
                <p>Working</p>
            </div>
        </div>
    </div>
</div>
