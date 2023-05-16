<script>
  import { useNavigate } from "svelte-navigator";

  //import { useNavigate, useLocation } from "svelte-navigator"; //TODO
  //import { user } from "../../stores/users.js"; TODO
  //import toastr from "toastr"; TODO
  //import 'toastr/build/toastr.min.css'; TODO

  const navigate = useNavigate();
  //const location = useLocation();TODO

  let email = "";
  let nickname = "";
  let password = "";
  let message = "";

  function handleSubmit() {
    console.log(email);
    console.log(nickname);
    console.log(password);

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
    }).then((response) => {
      if (response.status === 200) {
        const currentUser = { nickname, password };
        //user.set(currentUser);
        //localStorage.setItem('user', JSON.stringify(currentUser));
        //const from = ($location.state && $location.state.from) || "/home";
        navigate("/home", { replace: true });
      } else if (response.status === 404) {
        message = "Wrong credentials";
        /* TODO when loggin works
          toastr["error"]("Incorrect credentials");
          toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "hideDuration": "500",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "showDuration": "300"
      }
      */
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
    <p id="copyright-year">Andrea Di Claudio / © 2023</p>
  </div>
</div>
