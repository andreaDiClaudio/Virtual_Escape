<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";

  import Login from "./pages/login/Login.svelte";
  import Home from "./pages/home/home.svelte";

  /*
  import Signup from "./pages/signup/Signup.svelte";
  import Fallback from "./pages/fallBack/Fallback.svelte";
  import Contact from "./pages/contact/Contact.svelte";
  */
</script>

<Router primary={false}>
  <Route path="/">
    <Login />
  </Route>

  <PrivateRoute path="/home" let:location>
    <Home />
  </PrivateRoute>
</Router>
