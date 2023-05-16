<script>
    //import { useNavigate, useLocation } from "svelte-navigator"; //TODO
    //import { user } from "../../stores/users.js"; TODO
    //import toastr from "toastr"; TODO
    //import 'toastr/build/toastr.min.css'; TODO
  
    //const navigate = useNavigate();TODO
    //const location = useLocation();TODO
  
    let email = '';
    let nickname = '';
    let password = '';
    let message = '';
  
    function handleSubmit() {
      fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'nickname': nickname,
          'password': password,
          'email': email
        })
      })/* TODO when loggin works
      .then(response => {
        if (response.status === 200) {
          const currentUser = { nickname, password };
          user.set(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
          const from = ($location.state && $location.state.from) || "/home";
          navigate(from, { replace: true });
        } else if (response.status === 404) {
          message = "Wrong credentials";
  
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
        }
      });
      */
    }
  </script>
  
<div id="page">
  <div id="login-window">
    <div id="title-wrapper">
      <div id="title-content">
        <h1 id="title">Welcome</h1>
        <a href="/signup">
          <button id="signup-button">Don't you have an account?</button>
        </a>
      </div>
    </div>
    
    <div id="form-wrapper">
      <form id="login-form" on:submit|preventDefault={handleSubmit}>

        <div id="email-wrapper">
          <input id="email-input" class="input" type="email" name="email" placeholder="email@example.com" required bind:value={email}>
        </div>

        <div id="username-wrapper" data-name="username">
          <input id="username-input" class="input" type="text" name="username" placeholder="username" required bind:value={nickname}>
        </div>

        <div id="password-wrapper">
          <input id="password-input" class="input" type="password" name="password" placeholder="password" required bind:value={password}>
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