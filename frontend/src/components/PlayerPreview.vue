<template>
  <div style="width: 30%;" class="mx-auto">
    <b-card no-body bg-variant="dark" text-variant="white" id="playerCard">
      <b-row no-gutters>
        <b-col md="6"  no-gutters>
            <b-img v-bind:src="imageUrl" rounded="circle" alt="Player Image"/>
        </b-col>
        <b-col md="6"  no-gutters>
          <b-card-body v-bind:title="name">
          <b-card-text>
              Position: {{position}}
          </b-card-text>
          <b-card-text>
              Team: {{teamName}}
          </b-card-text>
          </b-card-body>
          <b-button href="#" @click="openPlayerPage()" variant="light" id="personalPage">
          Personal Page<b-icon icon="person-circle" animation="throb" font-scale="1"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>    
</template>


<script>
export default {
  name: "PlayerPreview",
  props: {
      id: {
        type: Number,
        required: true
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
      }
  },
  methods: {
    openPlayerPage(){
      this.$router.push("/players/playerDetails/" + this.id).catch(() => {
        this.$forceUpdate();
      });
    }
  },
};
</script>

<style >
#playerCard{
  margin-top: 5%;
  margin-bottom: 5%;
  padding: 3%;
}
</style>