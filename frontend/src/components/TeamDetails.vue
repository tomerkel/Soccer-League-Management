<template>
  <div class="mx-auto" style="width: 100%;">
    <h1 class="title">Team Page - {{ name }}</h1>
    <b-img center v-bind:src="logoUrl" ></b-img>

    <h1 class="title">Team Players</h1>
    <b-card-group deck>
      <PlayerPreview
      v-for="p in players"
      :id="p.playerID" 
      :name="p.name" 
      :imageUrl="p.image" 
      :position="p.position" 
      :teamName="p.teamName" 
      :favoriteButton="false"
      :key="p.playerID"></PlayerPreview>
    </b-card-group>

    <h1 class="title">Future Games</h1>
    <b-card-group deck>
      <GamePreview class="gamePreview"
      v-for="g in futureGames"
      :gameID="g.gameID" 
      :dateTime="g.gameDateTime" 
      :homeTeamID="g.homeTeamID"
      :awayTeamID="g.awayTeamID"
      :stadium="g.stadium"
      :favoriteButton="false"
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
import PlayerPreview from "./PlayerPreview.vue";
import GamePreview from "./GamePreview.vue";
export default {
  name: "TeamDetails",
  components: {
    PlayerPreview,
    GamePreview
  },
  data() {
    return {
      name: this.$root.store.previews[this.id].name,
      logoUrl: this.$root.store.previews[this.id].logo
    };
  },
  props: {
      id: {
        type: Number,
        required: true
      },
      players:{
          type: Array,
          required:true
      },
      futureGames: {
        type: Array,
        required: true
      },
      pastGames: {
        type: Array,
        required: true
      }
  }
};
</script>

<style>
h1{
  margin-top: 2%;
  text-align: center;
  font-weight: bolder;
}

.gamePreview{
  width: 30%;
}

</style>