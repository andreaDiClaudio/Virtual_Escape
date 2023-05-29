<script>
    import { onMount, onDestroy } from "svelte";
    import popup from "../../assets/js/profile/popup.js";

    onMount(() => {
        fetchUserImages();
    });

    /*FETCH USER IMAGES*/
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
                        popup.showPopup(img.src, image);
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
</script>

<div id="user-gallery-wrapper" />
