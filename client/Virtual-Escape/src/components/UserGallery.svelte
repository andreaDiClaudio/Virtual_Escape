<script>
    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        fetchUserImages();
    });

    //fetches user uploaded images to fill the gallery
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
                console.log(data);

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

                    // Create the zoom icon element
                    const zoomIcon = document.createElement("img");
                    zoomIcon.src =
                        "http://localhost:8080/public/webIcons/zoom-icon-white.png";
                    zoomIcon.className = "user-gallery-zoom-in-icon";
                    zoomIcon.setAttribute("hidden", "true");

                    // Create the opacity layer element
                    const opacityLayer = document.createElement("div");
                    opacityLayer.className = "user-gallery-opacity-layer";

                    // Show the zoom icon and opacity layer when the user hovers over the image card
                    div.onmouseover = function () {
                        zoomIcon.removeAttribute("hidden");
                        opacityLayer.style.display = "block";
                    };

                    div.onclick = function () {
                        showPopup(img.src, image);
                    };

                    // Hide the zoom icon and opacity layer when the user exits the hover over the image card
                    div.onmouseout = function () {
                        zoomIcon.setAttribute("hidden", "true");
                        opacityLayer.style.display = "none";
                    };

                    // Add the img, zoom icon, and opacity layer elements to the div
                    div.appendChild(img);
                    div.appendChild(opacityLayer);
                    div.appendChild(zoomIcon);

                    // Add the div element to the container
                    container.appendChild(div);
                });
            })
            .catch((error) => {
                console.error("Error fetching user images:", error);
            });
    }

    /*POPUP WINDOW*/
    // Function to show the popup with the selected image
    function showPopup(imageSrc, image) {
        // Remove any existing popup before creating a new one
        const existingPopup = document.getElementById("popup-window");
        if (existingPopup) {
            existingPopup.remove();
        }

        // Remove any existing background overlay before creating a new one
        const existingBackgroundOverlay =
            document.getElementById("background-overlay");
        if (existingBackgroundOverlay) {
            existingBackgroundOverlay.remove();
        }

        // Create the background overlay
        const backgroundOverlay = document.createElement("div");
        backgroundOverlay.id = "background-overlay";

        // Create the popup window
        const popupWindow = document.createElement("div");
        popupWindow.id = "popup-window";
        popupWindow.style.display = "flex";

        // Create the image preview wrapper
        const imagePreviewWrapper = document.createElement("div");
        imagePreviewWrapper.id = "popup-window-image-preview-wrapper";

        // Create the image preview
        const imagePreview = document.createElement("img");
        imagePreview.id = "popup-window-image-preview";
        imagePreview.src = imageSrc;

        // Add the image preview to the image preview wrapper
        imagePreviewWrapper.appendChild(imagePreview);

        // Create the information area
        const imageInfo = document.createElement("div");
        imageInfo.id = "popup-window-image-info";

        // Create the image description element
        const imageDescriptionElement = document.createElement("div");
        imageDescriptionElement.id = "popup-window-image-description";

        const descriptionTitle = document.createElement("h3");
        descriptionTitle.textContent = "Description:";
        imageDescriptionElement.appendChild(descriptionTitle);

        const descriptionText = document.createElement("p");
        descriptionText.id = "description-text";
        descriptionText.textContent = image.description || "";
        imageDescriptionElement.appendChild(descriptionText);

        // Hide the image description element if there's no description
        if (!image.description) {
            imageDescriptionElement.style.display = "none";
        }

        // Add the image description element to the information area
        imageInfo.appendChild(imageDescriptionElement);

        // Create the image game element
        const imageGameElement = document.createElement("div");
        imageGameElement.id = "user-profile-image-game";

        const gameTitle = document.createElement("h3");
        gameTitle.style.paddingTop = "2rem";
        gameTitle.textContent = "Game:";
        imageGameElement.appendChild(gameTitle);

        const gameText = document.createElement("p");
        gameText.id = "game-text";
        gameText.textContent = image.game;
        imageGameElement.appendChild(gameText);

        // Hide the image game element if there's no game
        if (!image.game) {
            imageGameElement.style.display = "none";
        }

        // Add the image game element to the information area
        imageInfo.appendChild(imageGameElement);

        // Add the image preview wrapper and information area to the popup window
        popupWindow.appendChild(imagePreviewWrapper);
        popupWindow.appendChild(imageInfo);
        if (
            (!image.game && !image.description) ||
            (image.game === "" && image.description === "")
        ) {
            imageInfo.style.display = "none";
        }

        // Add the background overlay and popup window to the body
        document.body.appendChild(backgroundOverlay);
        document.body.appendChild(popupWindow);

        /* TODO
        -Backend for patch the image info
        -front end fetch patch image info
        - After implemenitng the previous do likes and comments because of the websocket requirement (start only wiht likes and see how much time it takes)
        - After implemenitng the previous do the search user feature
        -After implemt the folder feature
        */

        /*OPTION BUTTON WRAPPER*/
        // Create the button for delete or edit post
        const optionButtonWrapper = document.createElement("div");
        optionButtonWrapper.id = "popup-window-option-button-wrapper";
        optionButtonWrapper.className = "popup-window-option-button-wrapper";

        const optionButton = document.createElement("button");
        optionButton.textContent = "•••";
        optionButton.className = "popup-window-option-button";
        optionButtonWrapper.appendChild(optionButton);
        popupWindow.appendChild(optionButtonWrapper);

        /*DROPDOWN MENU*/
        // Create the dropdown menu
        const dropdownMenu = document.createElement("div");
        dropdownMenu.className = "dropdown-menu";
        dropdownMenu.setAttribute("hidden", "true");
        optionButtonWrapper.appendChild(dropdownMenu);

        /*EDIT BUTTON*/
        // Create the 'edit' button
        const editButton = document.createElement("button");
        editButton.className = "dropdown-item";

        const editIcon = document.createElement("i");
        editIcon.className = "fas fa-pen";
        editIcon.style.paddingLeft = "0.5rem";
        editButton.appendChild(editIcon);

        // Add the editPopup function to the edit button
        editButton.addEventListener("click", () => editPopup(imageSrc));
        dropdownMenu.appendChild(editButton);

        /*DELETE BUTTON*/
        // Create the 'delete' button
        const deleteButton = document.createElement("button");
        deleteButton.className = "dropdown-item";

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash";
        deleteIcon.style.paddingLeft = "0.5rem";
        deleteButton.appendChild(deleteIcon);

        dropdownMenu.appendChild(deleteButton);

        // Show the background overlay and popup window
        backgroundOverlay.style.display = "block";
        popupWindow.style.display = "flex";

        // Close the popup when the background overlay is clicked
        backgroundOverlay.onclick = function () {
            backgroundOverlay.style.display = "none";
            popupWindow.style.display = "none";
        };

        // Toggle the dropdown menu when the options button is clicked
        optionButton.onclick = function () {
            dropdownMenu.classList.toggle("show");
        };
    }

    function editPopup(imageSrc) {
        const imageInfo = document.getElementById("popup-window-image-info");
        const imageDescriptionElement = document.getElementById(
            "popup-window-image-description"
        );
        const imageGameElement = document.getElementById(
            "user-profile-image-game"
        );

        // Show the hidden elements
        imageDescriptionElement.style.display = "block";
        imageGameElement.style.display = "block";
        imageInfo.style.display = "block";

        const descriptionText = document.getElementById("description-text");
        const gameText = document.getElementById("game-text");

        // Convert description text to input field
        const descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.value = descriptionText.textContent.trim();
        imageDescriptionElement.replaceChild(descriptionInput, descriptionText);

        // Convert game text to input field
        const gameInput = document.createElement("input");
        gameInput.type = "text";
        gameInput.value = gameText.textContent.trim();
        imageGameElement.replaceChild(gameInput, gameText);

        // Create save and discard buttons
        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.setAttribute("id", "image-info-edit-confirm-wrapper");

        const discardButton = document.createElement("button");
        discardButton.setAttribute("class", "user-info-update-buttons");
        discardButton.textContent = "Discard";
        discardButton.addEventListener("click", () => {
            window.location.href = "/profile";
        });

        const saveButton = document.createElement("button");
        saveButton.setAttribute("class", "user-info-update-buttons");
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", () => {
            //TODO
            console.log(gameInput.value, descriptionInput.value);
            // game title: gameInput.value
            //game description : descriptionInput.value
        });

        buttonsWrapper.appendChild(discardButton);
        buttonsWrapper.appendChild(saveButton);
        imageInfo.appendChild(buttonsWrapper);
    }
    /***************************/
</script>

<div id="user-gallery-wrapper" />
