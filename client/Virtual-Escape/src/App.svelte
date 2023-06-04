<script>
  import { Router, Link, Route } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";

  import Login from "./pages/login/Login.svelte";
  import Signup from "./pages/signup/Signup.svelte";
  import Home from "./pages/home/Home.svelte";
  import Upload from "./pages/upload/Upload.svelte";
  import Profile from "./pages/userProfile/Profile.svelte";
  import Search from "./pages/search/Search.svelte";
  import BestGame from "./pages/bestGame/BestGame.svelte";
  import Goodbye from "./pages/goodbye/Goodbye.svelte";

  import { titleStore } from "./stores/tabTitle/tabTitle.js";
  import ProfileFound from "./pages/profileFound/ProfileFound.svelte";
  import Contact from "./pages/contact/Contact.svelte";

  // Update the document title reactively
  $: document.title = $titleStore;
</script>

<svelte:head>
  <link
    rel="icon"
    type="image/png"
    href="http://localhost:8080/public/icon/tabIcon.png?v=2"
  />
</svelte:head>

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

  <PrivateRoute path="/upload">
    <Upload />
  </PrivateRoute>

  <PrivateRoute path="/profile">
    <Profile />
  </PrivateRoute>

  <PrivateRoute path="/search">
    <Search />
  </PrivateRoute>

  <PrivateRoute path="/search/:nickname">
    <ProfileFound />
  </PrivateRoute>

  <PrivateRoute path="/bestgame">
    <BestGame />
  </PrivateRoute>

  <PrivateRoute path="/contact">
    <Contact />
  </PrivateRoute>

  <Route path="/goodbye">
    <Goodbye />
  </Route>
</Router>
