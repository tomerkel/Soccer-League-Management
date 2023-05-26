<template>
  <div>
    <b-row>
      <b-col>
        <div>
          <b-card
          img-alt="Image"
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
          id="superLeague"
        >
          <b-card-title>{{leagueName}}</b-card-title>
          <b-card-text>
            Season: {{ season }}
            <br/>
            Stage: {{ stage }}
          </b-card-text>
        </b-card>
        </div>
        <div>
          <b-card-group deck>
            <GamePreview id="nextGame"
            v-for="g in nextGame"
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
      </b-col>
    </b-row>
  </div>

</template>

<script>
import GamePreview from "../components/GamePreview.vue";
export default {
  name: "leagueInfo",
  components: {
    GamePreview
  },
  data() {
    return {
      leagueName: "",
      season: "",
      stage: "",
      nextGame: []
      };
  },
  methods: {
    async getLeagueDetails() {
      try {
        const response = await this.axios.get(
          "http://localhost:3000/league/getDetails",
        );
        this.leagueName = response.data.leagueName;
        this.season = response.data.currentSeasonName;
        this.stage = response.data.currentStageName;
        if (this.stage == "There is no current stage"){
          this.stage = "None";
        }
        this.nextGame.push(response.data.nextGame);
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
#superLeague{
  width: 50%;
  background-color: #45d393;
  opacity: 0.9;
  margin: auto;
  text-align: center;
}

#nextGame{
  width: 62%;
}

.title {
  color: black;
}
</style>