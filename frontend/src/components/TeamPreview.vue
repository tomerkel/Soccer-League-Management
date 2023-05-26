<template>
  <div style="width: 30%;" class="mx-auto">
    <b-card no-body class="overflow-hidden" bg-variant="dark" text-variant="white" id="teamCard">
      <b-row no-gutters>
        <b-col md="6">
            <b-card-img v-bind:src="logo" alt="Team Image" class="rounded-0"></b-card-img>
        </b-col>
        <b-col>
          <b-card-body v-bind:title="name">
          </b-card-body>
          <b-button id="detailsButton" href="#" @click="openTeamPage()" variant="light">
            More Details<b-icon icon="info-circle-fill" animation="throb" font-scale="1"></b-icon>
          </b-button>
      </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "TeamPreview",
  props: {
      id: {
        type: Number,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      logo: {
        type: String,
        required: false
      }
  }, 
  methods: {
    openTeamPage(){
      this.$router.push("/teams/teamFullDetails/" + this.id).catch(() => {
        this.$forceUpdate();
        
      });
    }
  }
};
</script>

<style >
#teamCard{
  margin-top: 5%;
  margin-bottom: 5%;
  padding: 2%;
}

#detailsButton{
  margin-left: 10%;
}
</style>