<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Abril Fatface|Exo"/>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand :to="{ name: 'main' }">
        SUPERLEAGUE <b-icon icon="house-door-fill"></b-icon>
      </b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
        <b-nav-item :to="{ name: 'search' }">
          Search <b-icon icon="search"></b-icon>
        </b-nav-item>
        <b-nav-item :to="{ name: 'games' }">
          Current Stage <b-icon icon="trophy"></b-icon>
        </b-nav-item>
        <b-nav-item :to="{ name: 'about' }">
          About <b-icon icon="suit-heart"></b-icon>
          </b-nav-item>
        <b-nav-item v-if="$root.store.isAssoRep.includes('true')" @click="openManageLeaguePage()">Manage League
          <b-icon icon="graph-up"></b-icon>
        </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-if="!$root.store.username">
          <b-nav-item :to="{ name: 'login' }">
            Login <b-icon icon="box-arrow-right"></b-icon>
          </b-nav-item>
          <b-nav-item :to="{ name: 'register' }">
          Register <b-icon icon="pencil"></b-icon>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
        <b-nav-item-dropdown right>
          <template #button-content>
           {{$root.store.username}} <b-icon icon="person-plus-fill"></b-icon>
          </template>
          <b-dropdown-item href="#" @click="openUserFavoritesPage()">
           My Favorites <b-icon icon="bookmark-star-fill"></b-icon>
          </b-dropdown-item>
          <b-dropdown-item href="#" @click="Logout()">
            Log Out <b-icon icon="power"></b-icon>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    openUserFavoritesPage(){
      this.$router.push("/users/favorites/getGames").catch(() => {
        this.$forceUpdate();
      });
    },
    openAddGamePage(){
      this.$router.push("/associationRepresentatives/addGame").catch(()=>{
        this.$forceUpdate();
      });
    },
    openManageLeaguePage(){
      this.$router.push("/associationRepresentatives/manageLeague").catch(()=>{
        this.$forceUpdate();
      });
    },
    async Logout() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/Logout"
        );
        this.$root.store.logout();
        this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
        this.$root.toast("Logout", "User logged out successfully", "success");
      } catch (err) {
          console.log(err.response).data;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-image: url("./resources/background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  font-family: "Exo";
  font-weight: bold;
}

#nav {
  padding: 30px;
}

 .navbar.navbar-dark{
  background-color: #42b983!important;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
