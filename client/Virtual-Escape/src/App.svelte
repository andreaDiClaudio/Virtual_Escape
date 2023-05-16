<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";

  import Login from "./pages/login/Login.svelte";
  import Signup from "./pages/signup/Signup.svelte";
  import Home from "./pages/home/home.svelte";
</script>

<Router primary={false}>
  <Route path="/">
    <Login />
  </Route>

  <Route path="/signup">
    <Signup />
  </Route>

  <PrivateRoute path="/home" let:location>
    <Home />
  </PrivateRoute>
</Router>
