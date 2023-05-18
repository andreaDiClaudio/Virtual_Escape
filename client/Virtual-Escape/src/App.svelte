<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";

  import Login from "./pages/login/Login.svelte";
  import Signup from "./pages/signup/Signup.svelte";
  import Home from "./pages/home/Home.svelte";
  import UploadImages from "./pages/upload/Upload.svelte";

  import { titleStore } from "./stores/tabTitle/tabTitle.js";
  import Upload from "./pages/upload/Upload.svelte";

  // Update the document title reactively
  $: document.title = $titleStore;
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

  <PrivateRoute path="/upload" let:location>
    <Upload />
  </PrivateRoute>
</Router>
