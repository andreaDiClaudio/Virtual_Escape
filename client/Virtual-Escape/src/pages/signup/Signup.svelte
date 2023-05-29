<script>
    import "toastr/build/toastr.min.css";
    import toastr from "toastr";
    import { onMount, onDestroy } from "svelte";
    import { titleStore } from "../../stores/tabTitle/tabTitle.js";
    import Footer from "../../components/Footer.svelte";

    // Set tab title
    titleStore.setTitle("Signup | VE");

    let bodyGradient = false;

    onMount(() => {
        bodyGradient = true;
    });

    onDestroy(() => {
        titleStore.resetTitle();
        bodyGradient = false;
    });

    let email = "";
    let nickname = "";
    let password = "";
    let message = "";

    async function handleSubmit() {
        fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname: nickname,
                password: password,
                email: email,
            }),
            credentials: "include",
        }).then((response) => {
            if (response.status === 201) {
                window.location.href = "/";
            } else if (response.status === 400) {
                message = "User already exists";
                toastr.options = {
                    closeButton: false,
                    debug: false,
                    newestOnTop: false,
                    progressBar: false,
                    positionClass: "toast-top-left",
                    preventDuplicates: false,
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
                toastr["warning"]("Credentials already taken");
            }
        });
    }
</script>

<svelte:head>
    {#if bodyGradient}
        <style>
            body {
                background-image: linear-gradient(55deg, #f4dfc5, #e7793e);
            }
        </style>
    {/if}
</svelte:head>

<div id="page">
    <div id="login-window">
        <div id="image-wrapper">
            <img
                id="logo"
                src="http://localhost:8080/public/logo/logo.png"
                alt="Virtual Escape Logo"
            />
        </div>
        <div id="title-wrapper">
            <p>
                Already been here?
                <a id="signup-link" href="/">log in!</a>
            </p>
        </div>
        <div id="form-wrapper">
            <form id="login-form" on:submit|preventDefault={handleSubmit}>
                <div id="email-wrapper">
                    <input
                        id="email-input"
                        class="input"
                        type="email"
                        name="email"
                        placeholder="email@example.com"
                        required
                        bind:value={email}
                    />
                </div>
                <div id="username-wrapper" data-name="username">
                    <input
                        id="username-input"
                        class="input"
                        type="text"
                        name="username"
                        placeholder="username"
                        required
                        bind:value={nickname}
                    />
                </div>
                <div id="password-wrapper">
                    <input
                        id="password-input"
                        class="input"
                        type="password"
                        name="password"
                        placeholder="password"
                        required
                        bind:value={password}
                    />
                </div>
                <div id="button-wrapper">
                    <button
                        id="submit-form-button"
                        class="button"
                        type="submit"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    </div>
    <Footer />
</div>
