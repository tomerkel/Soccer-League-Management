<template>
  <div class="mx-auto" id="games">
    <div>
      <b-tabs content-class="mt-3" fill>
        <b-tab title="Future Games" active :title-link-class="'tab-title-class'">
          <b-table class="mx-auto" id="events" striped hover 
          :items= "this.futureItems"
          :fields= "futureFields"
          ></b-table>
        </b-tab>
        <b-tab title="Games History" :title-link-class="'tab-title-class'">
          <h2> Games:</h2>
          <b-table class="mx-auto" id="events" striped hover 
          :items= "this.pastItems"
          :fields= "pastFields">
          </b-table>
          <h2> Events:</h2>
          <b-table class="mx-auto" id="events" style="width:70%" striped hover 
          :items= "this.eventSchdule"
          :fields= "eventSchduleFields"
          ></b-table>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "allGames",
  data() {
    return {
      pastGames: [],
      futureGames: [],
      favoritesGames: [],
      futureItems: [],
      pastItems: [],
      eventSchdule: [],
      eventSchduleFields: [
        {
          key: 'gameID',
          label: 'Game ID'
        },
        {
          key: 'gameMinute',
          label: 'Minute'
        },
        {
          key: 'eventType',
          label: 'Type'
        },
        {
          key: 'description'
        },
      ],
      futureFields: [
        {
          key: 'date',
          sortable: true
        },
        {
          key: 'hour',
          sortable: false
        },
        {
          key: 'homeTeam',
          label: 'Home Team',
          sortable: true,
        },
        {
          key: 'awayTeam',
          label: 'Away Team',
          sortable: true,
        },
        {
          key: 'stadium',
          sortable: false,
        }
      ],
      pastFields: [
        {
          key: 'gameID',
          label: 'Game ID'
        },
        {
          key: 'date',
          sortable: true
        },
        {
          key: 'hour',
        },
        {
          key: 'homeTeam',
          label: 'Home Team',
          sortable: true,
        },
        {
          key: 'awayTeam',
          label: 'Away Team',
          sortable: true,
        },
        {
          key: 'stadium'
        },
        {
          key: 'Referee',
        },
        {
          key: 'Score',
        },
      ],
    }
  },
  methods: {
    async getAllGames(){
      try {
        const response = await this.axios.get(
          "http://localhost:3000/games/allGames",
        );
        const futureGames = response.data.futureGames;
        const pastGames = response.data.gamesHistory;
        this.fitGameToTable(futureGames, false);
        this.fitGameToTable(pastGames, true);
        this.futureGames.push(...futureGames);
        this.pastGames.push(...pastGames);
      } catch (error) {
        console.log(error);
      }
    },
    fitGameToTable(Games, past){
      if(past){
        for (let i in Games){
          this.pastItems.push({
            gameID: Games[i].gameDetails.gameID,
            date: Games[i].gameDetails.gameDateTime.split('T')[0],
            hour: Games[i].gameDetails.gameDateTime.split('T')[1].split('.')[0],
            homeTeam: this.$root.store.previews[Games[i].gameDetails.homeTeamID].name,
            awayTeam: this.$root.store.previews[Games[i].gameDetails.awayTeamID].name,
            stadium: Games[i].gameDetails.stadium,
            Referee: Games[i].gameDetails.referee,
            Score: Games[i].gameDetails.homeGoals + "-" + Games[i].gameDetails.awayGoals
          });
          for (let j in Games[i].gameEventSchedule){
            this.eventSchdule.push({
              gameID: Games[i].gameDetails.gameID,
              gameMinute: Games[i].gameEventSchedule[j].gameMinute,
              eventType: Games[i].gameEventSchedule[j].eventType,
              description: Games[i].gameEventSchedule[j].description
          });
          }
        }
      }
      else{
          for (let i in Games){
            this.futureItems.push({
            date: Games[i].gameDateTime.split('T')[0],
            hour: Games[i].gameDateTime.split('T')[1].split('.')[0],
            homeTeam: this.$root.store.previews[Games[i].homeTeamID].name,
            awayTeam: this.$root.store.previews[Games[i].awayTeamID].name,
            stadium: Games[i].stadium
            });
          }
        }
      }
  }, 
  mounted(){
    this.getAllGames();
  }
};
</script>

<style>

#games {
  width: 80%;
}

.tab-title-class {
  color: rgb(42, 48, 138)!important;
  background-color: rgb(163, 223, 205);
  margin: 1px;       
}
</style>
