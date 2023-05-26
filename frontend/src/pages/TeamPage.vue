<template>
  <div>
    <TeamDetails
      v-for="attr in this.teamFullDetails"
      :id="attr.teamID"
      :players="attr.teamPlayers" 
      :futureGames="attr.futureGames" 
      :pastGames="attr.gamesHistory" 
      :key="attr.teamID"></TeamDetails>
  </div>
</template>

<script>
import TeamDetails from "../components/TeamDetails.vue";
export default {
  name: "TeamPage",
  components: {
    TeamDetails
  }, 
  data() {
    return {
      teamFullDetails: []
    };
  },
  methods: {
    async loadTeamPage(teamID){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/teams/teamFullDetails/" + teamID,
        );
        const teamFullDetails = [response.data];
        this.teamFullDetails.push(...teamFullDetails);
      } catch (error) {
        console.log(error);
      }
    }
  }, 
  mounted(){
    this.loadTeamPage(this.$route.params.teamID); 
  }
};
</script>

<style></style>