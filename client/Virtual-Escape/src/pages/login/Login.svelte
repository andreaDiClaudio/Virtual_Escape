<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../../stores/users/users.js";

  import "toastr/build/toastr.min.css";
  import toastr from "toastr";
  import { onMount, onDestroy } from "svelte";
  import { titleStore } from "../../stores/tabTitle/tabTitle.js";

  // Update the document title when the component is mounted
  titleStore.setTitle("Login | VE");

  onMount(() => {
    document.body.classList.add("body-gradient");
  });

  // Reset the document title when the component is unmounted
  onDestroy(() => {
    titleStore.resetTitle();
    document.body.classList.remove("body-gradient");
  });

  const navigate = useNavigate();
  const location = useLocation();

  const currentYear = new Date().getFullYear();

  let email = "test@gmail.com";
  let nickname = "test";
  let password = "test";
  let message = "";

  function handleSubmit() {
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        nickname: nickname,
        password: password,
      }),
      credentials: "include",
    }).then((response) => {
      if (response.status === 200) {
        const currentUser = { nickname, email };
        user.set(currentUser);
        sessionStorage.setItem("user", JSON.stringify(currentUser));

        const from = "/home";
        navigate(from, { replace: true });
      } else if (response.status === 400 || response.status === 404) {
        message = "Wrong credentials";

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
        toastr["warning"]("Wrong Credentials, try again");
      }
    });
  }
</script>

<div id="page">
  <div id="login-window">
    <div id="image-wrapper">
      <img
        id="logo"
        src="../../src/assets/images/logo/logo.png"
        alt="Virtual Escape Logo"
      />
    </div>
    <div id="title-wrapper">
      <p>
        Welcome, <a id="signup-link" href="/signup">new to the platform?</a>
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
          <button id="submit-form-button" type="submit">Log in</button>
        </div>
      </form>
    </div>
  </div>

  <div id="copyright-year-wrapper">
    <p id="copyright-year">Andrea Di Claudio / © {currentYear}</p>
  </div>
</div>
