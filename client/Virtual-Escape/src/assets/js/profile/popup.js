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
    editButton.addEventListener("click", () => editPopup(image));
    dropdownMenu.appendChild(editButton);

    /*DELETE BUTTON*/
    // Create the 'delete' button
    const deleteButton = document.createElement("button");
    deleteButton.className = "dropdown-item";

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteIcon.style.paddingLeft = "0.5rem";
    deleteButton.appendChild(deleteIcon);

    //add the deleteButton function to delete button
    deleteButton.addEventListener("click", () => {
        // Adding an alert before fetching
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        return fetch("http://localhost:8080/api/images/" + image.id, {
            method: "DELETE",
            credentials: "include",
        }).then((response) => {
            if (response.status === 200) {
                window.location.href = "/profile";
            }
        });
    });
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

function editPopup(image) {
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
    discardButton.setAttribute("class", "button");
    discardButton.textContent = "Discard";
    discardButton.addEventListener("click", () => {
        window.location.href = "/profile";
    });

    const saveButton = document.createElement("button");
    saveButton.setAttribute("class", "button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        return fetch("http://localhost:8080/api/images/" + image.id, {
            method: "PATCH",
            body: JSON.stringify({
                description: descriptionInput.value,
                game: gameInput.value,
            }),
            credentials: "include",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            if (response.status === 404) {
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
                toastr["error"](
                    "Something Went Wrong. Please refresh the page"
                );
            } else if (response.status === 200) {
                window.location.href = "/profile";
            }
        });
    });

    buttonsWrapper.appendChild(discardButton);
    buttonsWrapper.appendChild(saveButton);
    imageInfo.appendChild(buttonsWrapper);
}

export default {
    showPopup,
    editPopup
}