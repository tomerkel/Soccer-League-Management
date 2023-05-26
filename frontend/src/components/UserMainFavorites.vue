<template>
  <div>
    <div v-if="userNextFavoritesGames.length > 0">
        <h2 class="title">Your Next Favorites Games</h2>
        <b-card-group deck>
          <GamePreview class="game"
          v-for="g in userNextFavoritesGames"
          :gameID="g.gameID" 
          :dateTime="g.gameDateTime" 
          :homeTeamID="g.homeTeamID"
          :awayTeamID="g.awayTeamID"
          :stadium="g.stadium"
          :favoriteButton="false"
          :key="g.gameID">
          </GamePreview>
        </b-card-group>
    </div>
    <h2 class="title" v-if="emptyFavoritesMessage">Your Favorites Games List Is Empty...</h2>

  </div>

</template>

<script>
import GamePreview from "./GamePreview.vue";
export default {
  name: "UserMainFavorites",
  components: {
    GamePreview
  },
  data() {
    return {
      userNextFavoritesGames: [],
      emptyFavoritesMessage: false
    };
  },
  methods: {
    async getLeagueDetails() {
      try {
        const response = await this.axios.get(
          "http://localhost:3000/league/getDetails",
        );
        const userNextFavoritesGames = response.data.userFavoritesFutureGames;
        if (userNextFavoritesGames.length > 0)
          this.userNextFavoritesGames.push(...userNextFavoritesGames);
        else
          this.emptyFavoritesMessage = true;
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted(){
    this.getLeagueDetails();
  }
};
</script>

<style>
.game {
  width: 60%;
}

h2{
  text-align: center;
}

</style>