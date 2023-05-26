<template>
  <div>
    <h1 class="title">Welcome to SUPERLEAGUE website</h1>
    <b-row>
      <b-col id="left"><LeagueInfo></LeagueInfo></b-col>
      <b-col id="right">
        <LoginPage v-if="!$root.store.username"></LoginPage>
        <UserMainFavorites v-else></UserMainFavorites>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import LeagueInfo from "../components/LeagueInfo.vue";
import LoginPage from "../pages/LoginPage.vue";
import UserMainFavorites from "../components/UserMainFavorites.vue"
export default {
  components: {
    LeagueInfo,
    LoginPage,
    UserMainFavorites
  }
};
</script>

<style lang="scss" scoped>

h1{
  margin-top: 4%;
  margin-bottom: 2%;
  text-align: center;
  font-weight: bolder;
}

#left{
  width: 25%;
}

#right{
  width: 75%;
}
</style>
