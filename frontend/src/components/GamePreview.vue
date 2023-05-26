<template>
  <div class="mx-auto">
    <b-card no-body bg-variant="secondary" text-variant="white" id="gameCard">
      <b-row no-gutters>
        <b-col>
          <b-card-body style="text-align: center;">
            <b-card-text>
              Date: {{ dateTime.split('T')[0] }}
            </b-card-text>
            <b-card-text>
              Hour: {{ dateTime.split('T')[1].split('.')[0] }}
            </b-card-text>
            <b-card-text>
              Stadium: {{ stadium }}
            </b-card-text>
            <b-card-text v-if="homeGoals != undefined">
              Home Team Goals: {{ homeGoals }}
            </b-card-text>
            <b-card-text v-if="awayGoals != undefined">
              Away Team Goals: {{ awayGoals }}
            </b-card-text>
            <b-card-text v-if="refereeName != undefined">
              Referee: {{ refereeName }}
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col>
          <b-card-text class= "teamName">
            {{ homeTeamName }}
          </b-card-text>
          <b-img class= "logo" v-if="homeTeamID" v-bind:src="homeTeamLogo" ></b-img>
          <b-button id="detailsButton" href="#" @click="openHomeTeamPage()" variant="light">
            More Details<b-icon icon="info-circle-fill" animation="throb" font-scale="1"></b-icon>
          </b-button>
        </b-col>
        <b-col class="teamName">
          VS 
        </b-col>
        <b-col>
          <b-card-text class= "teamName">
            {{ awayTeamName }}
          </b-card-text>
          <b-img class= "logo" v-if="awayTeamID" v-bind:src="awayTeamLogo" ></b-img>
          <b-button id="detailsButton" href="#" @click="openAwayTeamPage()" variant="light">
            More Details<b-icon icon="info-circle-fill" animation="throb" font-scale="1"></b-icon>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-button v-if="favoriteButton"
        variant="warning"
        style="display:block; margin-top:3%"
        class="mx-auto w-90"
        @click="addGameToFavorites()"> 
        Add Me To <b-icon icon="star-fill" animation="fade" font-scale="1"></b-icon>
        </b-button>
      </b-row>
      <b-row>
        <b-button v-if="gameEvents.length>0" v-b-toggle.events
          variant="info"
          style="display:block;"
          class="mx-auto w-90"
          id="events">
          Event Schedule</b-button>
        <b-collapse v-if="gameEvents.length>0" id="events" class="mt-2">
          <b-table
            :dark='true' 
            :striped='true'
            :bordered='true'
            :small='true'
            :hover='true'
            :fixed='true'
            :items= "gameEvents"
            :fields="eventFields"
          ></b-table>
        </b-collapse>
      </b-row>    
    </b-card>
  </div>    
</template>

<script>
export default {
  name: "GamePreview",
  data() {
    return {
      homeTeamName: this.$root.store.previews[this.homeTeamID].name,
      homeTeamLogo: this.$root.store.previews[this.homeTeamID].logo,
      awayTeamName: this.$root.store.previews[this.awayTeamID].name,
      awayTeamLogo: this.$root.store.previews[this.awayTeamID].logo,
      gameEvents:[],
      eventFields:[
        {key:'minute', label:'Game Minute', sortable: true, class: 'text-center'},
        {key:'type', label:'Event Type', sortable: true, class: 'text-center'},
        {key:'desc', label:'Description', sortable: true, class: 'text-center'}]
    };
  },
  props: {
      gameID: {
        type: Number,
        required: true
      },
      homeTeamID: {
        type: Number,
        required: true
      },
      awayTeamID: {
        type: Number,
        required: true
      },
      dateTime: {
        type: String,
        required: true
      },
      stadium: {
        type: String,
        required: true
      },
      homeGoals: {
        type: Number,
        required: false
      },
      awayGoals: {
        type: Number,
        required: false
      },
      refereeName: {
        type: String,
        required: false
      },
      favoriteButton: {
        type: Boolean,
        required: true
      },
      eventSchedule: {
        type: Array,
        required: false
      }
  }, 
  methods: {
    async addGameToFavorites(){
      try {
        const response = await this.axios.post(
          "http://localhost:3000/users/favorites/addGame",
            {
              gameID: this.gameID,
          }
        );
        this.favoriteButton = false;
        this.$root.toast("Favorites", "Game has been successfully added to your favorites!", "success");
      } catch (error) {
        console.log("error in allGamesPage")
        console.log(error);
      }
    },
    processGameEvents(){
      for (let i=0;i < this.eventSchedule.length; i++){
        const e = this.eventSchedule[i];
        this.gameEvents.push({
          minute:e.gameMinute,
          type:e.eventType,
          desc:e.description
        });
      }
    },
    openHomeTeamPage(){
      this.$router.push("/teams/teamFullDetails/" + this.homeTeamID).catch(() => {
        this.$forceUpdate();
      });
    },
    openAwayTeamPage(){
      this.$router.push("/teams/teamFullDetails/" + this.awayTeamID).catch(() => {
        this.$forceUpdate();
      });
    },
  },
  mounted(){
    if (this.eventSchedule){
      this.processGameEvents();
    }
  }
};
</script>

<style>
#gameCard{
  margin-top: 5%;
  margin-bottom: 5%;
  padding: 3%;
}

#detailsButton{
  zoom: 0.7;
  margin-left: 10%;
  margin-top: 4%;
  font-size: 16px;
}

.teamName{
  text-align: center;
}

.logo {
  zoom: 0.6;
  margin-left: 10%;
}

#events{
  background-color: #42b983!important;
  border-color: #42b983!important;
  margin-top: 3%;
}

</style>
