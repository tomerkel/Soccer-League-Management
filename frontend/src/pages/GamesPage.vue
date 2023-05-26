<template>
  <div class="mx-auto" style="width: 100%;">
    <h1 class="title">Current Stage Games
      <b-icon icon="calendar2-week" animation="fade" font-scale="1"></b-icon>
    </h1>

    <h1 class="title">Future Games</h1>
    <b-card-group deck>
      <GamePreview class="gamePreview"
      v-for="g in futureGames"
      :gameID="g.gameID" 
      :dateTime="g.gameDateTime" 
      :homeTeamID="g.homeTeamID"
      :awayTeamID="g.awayTeamID"
      :stadium="g.stadium"
      :favoriteButton="setFavoriteButton(g)"
      :key="g.gameID"></GamePreview>
    </b-card-group>

    <h1 class="title">Games History</h1>
    <b-card-group deck>
      <GamePreview class="gamePreview"
      v-for="g in pastGames"
      :gameID="g.gameDetails.gameID" 
      :dateTime="g.gameDetails.gameDateTime" 
      :homeTeamID="g.gameDetails.homeTeamID"
      :awayTeamID="g.gameDetails.awayTeamID"
      :stadium="g.gameDetails.stadium"
      :homeGoals="g.gameDetails.homeGoals"
      :awayGoals="g.gameDetails.awayGoals"
      :refereeName="g.gameDetails.referee"
      :favoriteButton="false"
      :eventSchedule="g.gameEventSchedule"
      :key="g.gameDetails.gameID"></GamePreview>
    </b-card-group>
  </div>
</template>

<script>
import GamePreview from "../components/GamePreview.vue";
export default {
  name: "allGames",
  components: {
    GamePreview
  }, 
  data() {
    return {
      futureGames: [],
      pastGames: [],
      favoritesGames: [],
    };
  },
  methods: {
    async getAllGames(){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/games/allGames",
        );
        const futureGames = response.data.futureGames;
        const pastGames = response.data.gamesHistory;
        this.futureGames.push(...futureGames);
        this.pastGames.push(...pastGames);
      } catch (error) {
        console.log(error);
      }
    },
    async getLoggeInUserFavoritesGames(){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/users/favorites/getGames",
        );
        const favoritesGames = response.data;
        this.favoritesGames.push(...favoritesGames);
      } catch (error) {
        console.log("error in allGamesPage")
        console.log(error);
      }
    },
    setFavoriteButton(g){
      if (this.$root.store.username){
        const gameExist = this.favoritesGames.find((game) => g.gameID == game.gameID);
          if(gameExist)
            return false;
        return true;
      }
      return false;
    }
  }, 
  mounted(){
    this.getAllGames();
    if (this.$root.store.username)
      this.getLoggeInUserFavoritesGames();
  }
};
</script>

<style>
h1{
  margin-top: 4%;
  text-align: center;
  font-weight: bolder;
}

.gamePreview{
  width: 30%;
}

</style>
