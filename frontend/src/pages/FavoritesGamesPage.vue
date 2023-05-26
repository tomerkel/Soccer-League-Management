<template>
  <div>
    <h1>My Favorites Games
      <b-icon icon="trophy-fill" animation="fade" font-scale="1"></b-icon>
    </h1>
    <b-card-group>
      <GamePreview class="gamePreview"
      v-for="g in favoritesGames"
      :gameID="g.gameID" 
      :dateTime="g.gameDateTime"
      :homeTeamID="g.homeTeamID"
      :awayTeamID="g.awayTeamID"
      :stadium="g.stadium"
      :favoriteButton="false"
      :key="g.gameID"></GamePreview>
    </b-card-group>
  </div>
</template>

<script>
import GamePreview from "../components/GamePreview.vue";
export default {
  name: "FavoritesGamesPage",
  components: {
    GamePreview
  }, 
  data() {
    return {
      favoritesGames: []
    };
  },
  methods: {
    async getUserFavoritesGames(){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/users/favorites/getGames",
        );
        const favoritesGames = response.data;
        this.favoritesGames.push(...favoritesGames);
      } catch (error) {
        console.log(error);
      }
    }
  }, 
  mounted(){
    this.getUserFavoritesGames(); 
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
