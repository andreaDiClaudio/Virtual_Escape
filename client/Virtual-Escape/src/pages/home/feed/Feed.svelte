<script>
    import { onMount } from "svelte";

    onMount(async () => {
        await fetchAllImages();
    });

    /*To shuffle the images*/
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let images;
    /*Fetch user found images*/
    async function fetchAllImages() {
        try {
            const response = await fetch("http://localhost:8080/api/images/", {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                const res = await response.json();
                images = res.data;
                let shuffledImages = shuffleArray(images);
                console.log(shuffledImages);
            }
        } catch (error) {
            console.error("Error fetching user images:", error);
        }
    }
</script>

<div id="hr-div">
    <hr id="horizontal-line" />
    <h4>Discover</h4>
</div>
