
<template>
  <div id="tabs">
    <b-tabs content-class="mt-3">
      <b-tab title="League Games" active :title-link-class="'tab-title-class'">
        <GamesPageAssoRep></GamesPageAssoRep>
        </b-tab>
      <b-tab title="Add Game" :title-link-class="'tab-title-class'">
        <AddGamePage></AddGamePage>
      </b-tab>
      <b-tab title="Add Result" :title-link-class="'tab-title-class'">
        <AddResultPage></AddResultPage>
      </b-tab>
      <b-tab title="Add Referee" :title-link-class="'tab-title-class'"><p>Form for add referee to game</p></b-tab>
      <b-tab title="Add Event" :title-link-class="'tab-title-class'">
        <AddEventPage></AddEventPage>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import GamesPageAssoRep from "./GamesPageAssoRep.vue";
import AddGamePage from "./AddGamePage.vue";
import AddResultPage from "./AddResultPage.vue"
import AddEventPage from './AddEventPage.vue';
export default {
  name: "manageLeague",
  components: {
  GamesPageAssoRep,
  AddGamePage,
  AddResultPage,
  AddEventPage
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 500px;
}

.title {
  color: black;
}

.title:hover {
  color: rgb(42, 48, 138);
}

</style>