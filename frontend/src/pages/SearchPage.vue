<template>
  <div>
    <h1 class="title">Search Page
      <b-icon icon="zoom-in" animation="fade" font-scale="1"></b-icon>
    </h1>
    <div id="searchPage">
      <b-input-group prepend="Search Query:" id="search-input">
        <b-form-input v-model="searchQuery"></b-form-input>
        <b-input-group-append>
          <b-button :disabled="searchQuery==''||selected==''" variant="success" @click="search()" class="searchBtn" id="search">Search</b-button>
        </b-input-group-append>

      </b-input-group>
      <b-form-group label="What do you want to Search?" v-slot="{ ariaDescribedby }">
        <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios" value="Players">Players</b-form-radio>
        <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios" value="Teams">Teams</b-form-radio>
      </b-form-group>
      <br/>
      Your search Query: {{ queryToUser }}
      <br/>
      <div v-if="selected=='Players'">
        <b-form-select v-model="positionFilter" :options="positionOptions" class="filter"></b-form-select>
        <b-form-select v-model="teamFilter" :options="teamsNames" class="filter"></b-form-select>
      </div>
    </div>

    <div id="playerSort">
      <b-button v-if="players.length > 0" variant="success" @click="sortPlayersByTeam()" class="searchBtn">Sort Players by Team Name</b-button>
      <b-button v-if="players.length > 0" variant="success" @click="sortPlayers()" class="searchBtn">Sort Players by Name</b-button>
      <b-button v-if="teams.length > 0" variant="success" @click="sortTeams()" class="searchBtn">Sort by Team Name</b-button>
    </div>

    <b-card-group>
      <PlayerPreview
      v-for="p in players"
      :id="p.id" 
      :name="p.name" 
      :imageUrl="p.image" 
      :position="p.position" 
      :teamName="p.teamName" 
      :key="p.id"></PlayerPreview>
    </b-card-group>

    <b-card-group>
      <TeamPreview
      v-for="t in teams"
      :id="t.teamID" 
      :name="t.teamName" 
      :logo="t.logo" 
      :key="t.teamID"></TeamPreview>
    </b-card-group>
  </div>
</template>

<script>
import PlayerPreview from "../components/PlayerPreview.vue";
import TeamPreview from "../components/TeamPreview.vue";
import teamsNames from "../assets/teams";

export default {
  name: "Search",
  components: {
    PlayerPreview,
    TeamPreview
  }, 
 data() {
    return {
      searchQuery:"",
      queryToUser:"",
      selected: "",
      positionFilter: null,
      positionOptions: [
        { value: null, text: 'Please select position filter' },
        { value: 1, text: 'Position 1' },
        { value: 2, text: 'Position 2' },
        { value: 3, text: 'Position 3' },
        { value: 4, text: 'Position 4' },],
      teamFilter: null,
      teamsNames: [{ value: null, text: 'Please select team filter'}],
      players:[],
      teams:[],
      mapTeamsToShorts: {
        "København": "COP",
        "Brøndby": "SLO",
        "SønderjyskE": "SON",
        "Nordsjælland": "FCN",
      },
    };
  },
    methods: {
    async searchPlayers(){
      this.buildPlayerSearchQuery();
      const response = await this.axios.get(
      "http://localhost:3000/players/search/"+this.searchQuery,
      );
      const players = response.data;
      this.players.push(...players);
      this.positionFilter = null;
      this.teamFilter = null;
      localStorage.setItem("lastSearchResults", JSON.stringify(this.players));
    },
    async searchTeams(){
      const response = await this.axios.get(
        "http://localhost:3000/teams/search/"+this.searchQuery,
      );
        const teams = response.data;
        this.teams.push(...teams);
      localStorage.setItem("lastSearchResults", JSON.stringify(this.teams));
    },
    async search(){
      try{
          this.queryToUser = this.searchQuery;
          localStorage.setItem("lastSearchType", this.selected);
          this.players = [];
          this.teams = [];
        if (this.selected == "Players"){
          await this.searchPlayers();
        }
        else if (this.selected == "Teams"){
          await this.searchTeams();
        }
        this.searchQuery = "";
        localStorage.setItem("lastSearchQuery", this.queryToUser);
      }
      catch (error) {
        console.log("error in update search page")
        console.log(error);
        let errorMessage = 'There are no results'
        if (this.selected == "Players")
          errorMessage = 'Player not found'
        else if (this.selected == "Teams")
          errorMessage = 'Team not found'
        this.$root.toast("Search Result", errorMessage, "warning");

        this.searchQuery = "";
      }
    },
    buildPlayerSearchQuery(){
      if (this.teamFilter in this.mapTeamsToShorts){
        this.teamFilter = this.mapTeamsToShorts[this.teamFilter];
      }
      const positionUserString =  ", Position Filter: " + this.positionFilter;
      const positionQueryString =   "position=" + this.positionFilter;
      const teamUserString =  ", Team Filter: " + this.teamFilter;
      const teamQueyString = "teamFullName=" + this.teamFilter;
      if (this.positionFilter && !this.teamFilter){
        this.queryToUser += positionUserString;
        this.searchQuery += '?'+positionQueryString;
      }
      else if (this.teamFilter && !this.positionFilter){
        this.queryToUser += teamUserString;
        this.searchQuery += '?'+teamQueyString
      }
      else if (this.teamFilter && this.positionFilter){
        this.queryToUser += positionUserString + teamUserString;
        this.searchQuery +='?'+positionQueryString + '&' + teamQueyString;
      }
    },
    sortPlayers(){
      this.players.sort((first,second)=> (first.name > second.name ? 1 : -1));
    },
    sortPlayersByTeam(){
      this.players.sort((first,second)=> (first.teamName > second.teamName ? 1 : -1));
    },
    sortTeams(){
      this.teams.sort((first,second)=> (first.teamName > second.teamName ? 1 : -1));
    }
  }, 
  mounted(){
    this.teamsNames.push(...teamsNames);
    if (localStorage.lastSearchQuery){
      this.queryToUser = localStorage.lastSearchQuery;
      if (localStorage.lastSearchType == "Players")
        this.players.push(...JSON.parse(localStorage.lastSearchResults));
      else
        this.teams.push(...JSON.parse(localStorage.lastSearchResults));
    }

  }
}
</script>

<style scoped>
#searchPage{
  margin-left: 3%;
  margin-top: 1%;
}
h1{
  margin-top: 4%;
  text-align: center;
  font-weight: bolder;
}

#container {
  justify-content: space-between;
  display: flex;
  height: 100%;
  width: 100%;
}

#results {
  width: 50%;
  height: 100%;
}

#playerSort{
  padding: 10px;
  width: 50%;
  margin-top: 1%;
}

.filter{
  margin-left: 20px; 
  width: 500px;
}

.searchBtn {
  box-shadow: inset 0px 1px 0px 0px #42b983;
  background: linear-gradient(to bottom, #2ca55a 5%, #339b6f 100%);
  background-color: #42b983;
  border-radius: 10px;
  border: 2px solid #41a145;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: "Exo";
  font-size: 15px;
  font-weight: bold;
  padding: 10px 25px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #269146;
  width: 25%;
  display: block;
  margin-left: 30%;
  margin-top: 2%;
}

.searchBtn:hover {
  background: linear-gradient(to bottom, #2ca55a 5%, #339b6f 100%);
  background-color: #42b983;
}

.searchBtn:active {
  position: relative;
  top: 1px;
}

#search {
  margin: 0%;
  transition: all 0.1s ease;
  width: 100px;
}

#search:hover {
  transform: scale(1.4);
}

#search-input {
  margin-left: 20px; 
  width: 500px;
}
</style>