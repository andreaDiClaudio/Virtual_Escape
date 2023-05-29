function showProfileFoundPopup(imageSrc, image) {
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

    // Show the background overlay and popup window
    backgroundOverlay.style.display = "block";
    popupWindow.style.display = "flex";

    // Close the popup when the background overlay is clicked
    backgroundOverlay.onclick = function () {
        backgroundOverlay.style.display = "none";
        popupWindow.style.display = "none";
    };
}

export default showProfileFoundPopup;