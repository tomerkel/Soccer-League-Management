import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage")
  },
  {
    path: "/games/allGames",
    name: "games",
    component: () => import("./pages/GamesPage")
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage")
  },
  {
    path: "/players/playerDetails/:playerID",
    name: "playerPersonalPage",
    component: () => import("./pages/PlayerPersonalPage")
  },
  {
    path: "/teams/teamFullDetails/:teamID",
    name: "teamPage",
    component: () => import("./pages/TeamPage")
  },
  {
    path: "/associationRepresentatives/manageLeague",
    name: "manageLeaguePage",
    component: () => import("./pages/ManageLeaguePage")
  },
  {
    path: "/associationRepresentatives/addGame",
    name: "addGamePage",
    component: () => import ("./pages/AddGamePage")
  },
  {
    path: "/associationRepresentatives/addGameResult",
    name: "AddResultPage",
    component: () => import ("./pages/AddResultPage")
  },
  {
    path: "/users/favorites/getGames",
    name: "favoritesPage",
    component: () => import("./pages/FavoritesGamesPage")
  },
  

  {
    path: "*",
    name: "notFound",
    component: NotFound
  }
];

export default routes;
