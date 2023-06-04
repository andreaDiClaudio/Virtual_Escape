<script>
    import Navbar from "../../components/navbar/Navbar.svelte";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";

    /*Set tab title*/
    titleStore.setTitle("Contact us | VE");

    /*Reset tabtitle*/
    onDestroy(() => {
        titleStore.resetTitle();
    });

    let subject;
    let message;

    function handleSubmit() {
        const user = JSON.parse(sessionStorage.getItem("user"));

        fetch("http://localhost:8080/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: user.email,
                subject: subject,
                message: message,
            }),
            credentials: "include",
        }).then((response) => {
            if (response.status === 200) {
                window.location.reload();
            }
        });
    }
</script>

<Navbar />
<div id="contact-page">
    <div id="contact-page-content">
        <div class="contact-page-description">
            <h1 id="contact-page-title">Contact</h1>
            <h4>Give us a feedback!</h4>
        </div>
        <div id="contact-page-form-wrapper">
            <form id="contact-form" on:submit|preventDefault={handleSubmit}>
                <input
                    type="text"
                    placeholder="Subject"
                    class="contact-page-input"
                    required
                    bind:value={subject}
                /><br />
                <textarea
                    placeholder="Message"
                    class="contact-page-input"
                    rows="10"
                    required
                    bind:value={message}
                /><br />
                <div id="contact-page-button-wrapper">
                    <button type="submit" class="button">Send email</button>
                </div>
            </form>
        </div>
    </div>
</div>
