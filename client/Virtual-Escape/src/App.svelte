<script>
  import Login from "./pages/login/Login.svelte";
  import Signup from "./pages/signup/Signup.svelte";
  import Home from "./pages/home/home.svelte";
  import { Router, Link, Route } from "svelte-navigator";
</script>

<Router>
  <Route path="/">
    <Login />
  </Route>

  <Route path="/signup">
    <Signup />
  </Route>

  <Route path="/home">
    <Home />
  </Route>
</Router>
