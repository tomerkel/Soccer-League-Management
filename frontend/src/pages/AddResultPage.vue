<template>
    <div class="container">
        <h1 class="title">Add Game Result</h1>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">

        <b-form-group
            id="input-group-gameID"
            label-cols-sm="3"
            label="Game Id:"
            label-for="gameID"
        >
            <b-form-input
            id="gameID"
            v-model="$v.form.gameID.$model"
            type="number"
            :state="validateState('gameID')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.gameID.required">
            Game Id is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.gameID.numeric">
            Game Id must be numeric
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-homeTeamGoals"
            label-cols-sm="3"
            label="Home Goals:"
            label-for="homeTeamGoals"
        >
            <b-form-input
            id="homeTeamGoals"
            v-model="$v.form.homeTeamGoals.$model"
            type="number"
            :state="validateState('homeTeamGoals')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.homeTeamGoals.required">
            Goals for Home Team is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.homeTeamGoals.numeric">
            Goals Amount must be numeric
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-awayTeamGoals"
            label-cols-sm="3"
            label="Away Goals:"
            label-for="awayTeamGoals"
        >
            <b-form-input
            id="awayTeamGoals"
            v-model="$v.form.awayTeamGoals.$model"
            type="number"
            :state="validateState('awayTeamGoals')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.awayTeamGoals.required">
            Goals for Away Team is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.awayTeamGoals.numeric">
            Goals Amount must be numeric
            </b-form-invalid-feedback>
        </b-form-group>
        <b-button type="reset" variant="danger">Reset</b-button>
        <b-button
        type="submit"
        variant="primary"
        class="ml-5w-75"
        >Submit</b-button
      >
        </b-form>
        <b-alert
        class="mt-2"
        v-if="form.submitError"
        variant="warning"
        dismissible
        show
        >
        Game Result Addition failed: {{ form.submitError }}
        </b-alert>
    </div>
</template>

<script>
import {
  required,
  numeric
} from "vuelidate/lib/validators";

export default {
  name: "addResult",
  data() {
    return {
      form: {
        gameID: null,
        homeTeamGoals: null,
        awayTeamGoals: null
      },
    };
  },
  validations: {
    form: {
      gameID: {
        required,
        numeric
      },
      homeTeamGoals: {
        required,
        numeric
      },
      awayTeamGoals: {
        required,
        numeric
      }
    }
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async addGameResult() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/associationRepresentatives/addScoreToGame",
          {
            gameID: this.form.gameID,
            homeGoals: this.form.homeTeamGoals,
            awayGoals: this.form.awayTeamGoals
          }
        );
        this.$root.toast("Add Game", "The result has been added successfully to the requested game", "success");
        this.onReset();
      } catch (err) {
        this.form.submitError = err.response.data;
        this.$root.toast("Add Game", this.form.submitError, "failure");
      }
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.addGameResult();
    },
    onReset() {
      this.form = {
        gameID: "",
        homeTeamGoals: "",
        awayTeamGoals: ""
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 500px;
}

.ml-5w-75{
  width: 40%;
  margin-left: 28%;
  background-color: #42b983!important;
  border-color: #42b983!important;
}

.title {
  text-align: center;
}
</style>
