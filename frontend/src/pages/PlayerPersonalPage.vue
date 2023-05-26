<template>
  <div class="mx-auto" style="width: 70%;" id="details" >
    <PlayerDetails 
      v-for="attr in playerFullDetails"
      :name="attr.name" 
      :imageUrl="attr.imageUrl" 
      :position="attr.positionNumber" 
      :teamName="attr.teamName" 
      :commonName="attr.commonName" 
      :nationality="attr.nationality" 
      :birthDate="attr.birthDate" 
      :birthCountry="attr.birthCountry" 
      :height="attr.height" 
      :weight="attr.weight" 
      :key="attr.id"></PlayerDetails>
  </div>
</template>

<script>
import PlayerDetails from "../components/PlayerDetails.vue";
export default {
  name: "PlayerPersonalPage",
  components: {
    PlayerDetails
  }, 
  data() {
    return {
      playerFullDetails: []
    };
  },
  methods: {
    async loadPlyerPersonalPage(playerID){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/players/playerDetails/" + playerID,
        );
        const playerFullDetails = [response.data];
        this.playerFullDetails.push(...playerFullDetails);

      } catch (error) {
        console.log(error);
      }
    }
  }, 
  mounted(){
    this.loadPlyerPersonalPage(this.$route.params.playerID); 
  }
};
</script>

<style>
#details{
  font-family: "Exo";
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
}
</style>