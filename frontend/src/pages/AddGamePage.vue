<template>
    <div class="container">
        <h1 class="title">Add Game</h1>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">

        <b-form-group
            id="input-group-date"
            label-cols-sm="3"
            label="Date:"
            label-for="date"
        >
            <b-form-input
            id="date"
            v-model="$v.form.date.$model"
            type="date"
            :state="validateState('date')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.date.required">
            Date is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="$v.form.date.required && !$v.form.date.length">
            Year have only 4 digits
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.hour.futureDate">
            Tommorow is the earliest date to enter
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-hour"
            label-cols-sm="3"
            label="Hour:"
            label-for="hour"
        >
            <b-form-input
            id="hour"
            v-model="$v.form.hour.$model"
            type="text"
            :state="validateState('hour')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.hour.required">
            Hour is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.hour.legalHour">
            Hour must be in range 00:00,23:59
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-homeTeam"
            label-cols-sm="3"
            label="Home Team:"
            label-for="homeTeam"
        >
            <b-form-select
            id = "homeTeam"
            v-model="$v.form.homeTeam.$model"
            :options="teamsNames"
            :state="validateState('homeTeam')"
            ></b-form-select>
            <b-form-invalid-feedback v-if="!$v.form.homeTeam.required">
            Home Team is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
            v-else-if="!$v.form.homeTeam.differenTeams"
            >
            Must be different from Away Team.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-awayTeam"
            label-cols-sm="3"
            label="Away Team:"
            label-for="awayTeam"
        >
            <b-form-select
            id = "awayTeam"
            v-model="$v.form.awayTeam.$model"
            :options="teamsNames"
            :state="validateState('awayTeam')"
            ></b-form-select>
            <b-form-invalid-feedback v-if="!$v.form.awayTeam.required">
            Away Team is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
            v-else-if="!$v.form.awayTeam.differenTeams"
            >
            Must be different from Home Team.
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-stadium"
            label-cols-sm="3"
            label="Stadium:"
            label-for="stadium"
        >
            <b-form-input
            id="stadium"
            v-model="$v.form.stadium.$model"
            type="text"
            :state="validateState('stadium')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.stadium.required">
            Stadium is required
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-referee"
            label-cols-sm="3"
            label="Referee:"
            label-for="referee"
        >
            <b-form-input
            id="referee"
            v-model="$v.form.referee.$model"
            type="text"
            :state="validateState('referee')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.referee.required">
            Referee is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.referee.numeric">
            Enter the referee id
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
        Game Addition failed: {{ form.submitError }}
        </b-alert>
    </div>
</template>

<script>
import {
  required,
  alpha,
  sameAs,
  not,
  maxLength,
  numeric
} from "vuelidate/lib/validators";
import teamsNames from "../assets/teams";
import teamsToIDs from "../assets/teamsToIDs";
export default {
  name: "addGame",
  data() {
    return {
      form: {
        date: "",
        hour: "",
        homeTeam: null,
        awayTeam: null,
        stadium: "",
        referee: "",
      },
      teamsNames: [{ value: null, text: 'Choose Team...'}]
    };
  },
  validations: {
    form: {
      date: {
        required,
        length: (date) => maxLength(10)(date),
        futureDate(date) {
            return (
                
                new Date().getTime() < new Date(date).getTime()
            );
        }
      },
      hour: {
        required,
        legalHour(hour) {
            return (
                /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(hour)
            );
        }
      },
      homeTeam: {
        required,
        differenTeams: not(sameAs("awayTeam"))
      },
      awayTeam: {
        required,
        differenTeams: not(sameAs("homeTeam"))
      },
      stadium: {
        required,
        alpha
      },
      referee: {
        required,
        numeric
      }
    }
  },
  mounted(){
    this.teamsNames.push(...teamsNames);
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async addGame() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/associationRepresentatives/addGame",
          {
            gameDateTime: this.form.date.toString() + " " + this.form.hour,
            homeTeam: teamsToIDs[this.form.homeTeam],
            awayTeam: teamsToIDs[this.form.awayTeam],
            stadium: this.form.stadium,
            referee: this.form.referee
          }
        );
        this.$root.toast("Add Game", "Game added successfully", "success");
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
      this.addGame();
    },
    onReset() {
      this.form = {
        date: "",
        hour: "",
        homeTeam: "",
        awayTeam: "",
        stadium: "",
        referee: ""
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
