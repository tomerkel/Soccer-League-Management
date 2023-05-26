<template>
  <div id="playerDetails">
    <div>
     <h1>Player Page - {{ name }}</h1> 
      <b-img v-bind:src="imageUrl" rounded="circle"></b-img>
    </div>
    <b-list-group class="mx-auto" style="width: 50%;">
      <b-list-group-item>Common Name: {{ commonName }}</b-list-group-item>
      <b-list-group-item>Position: {{ position }}</b-list-group-item>
      <b-list-group-item>Team: {{ teamName}}</b-list-group-item>
      <b-list-group-item>Nationality: {{ nationality }}</b-list-group-item>
      <b-list-group-item>Birth Date: {{ birthDate }}</b-list-group-item>
      <b-list-group-item>Birth Country: {{ birthCountry }}</b-list-group-item>
      <b-list-group-item v-if="height">Height: {{ height }}</b-list-group-item>
      <b-list-group-item v-if="weight">weight: {{ weight }}</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "PlayerDetails",
  props: {
      id: {
        type: Number,
        required: false
      },
      name:{
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      position: {
        type: Number,
        required: true
      },
      teamName: {
        type: String,
        required: true
      },
      commonName:{
        type: String,
        required: true
      },
      nationality:{
        type: String,
        required: true
      },
      birthDate:{
        type: String,
        required: true
      },
      birthCountry:{
        type: String,
        required: true
      },
      height:{
        type: String,
        required: false
      },
      weight:{
        type: String,
        required: false
      }
  }
};
</script>

<style>
#playerDetails{
  text-align: center;
  margin-bottom: 5%
}

h1{
  font-weight: bolder;
}

.list-group-item{
  background-color: #42b983;
  opacity: 0.9;
}

</style>