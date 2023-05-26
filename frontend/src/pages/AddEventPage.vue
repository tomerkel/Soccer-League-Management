<template>
    <div class="container">
        <h1 class="title">Add Event</h1>
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
            id="input-group-gameMinute"
            label-cols-sm="3"
            label="Minute:"
            label-for="gameMinute"
        >
            <b-form-input
            id="gameMinute"
            v-model="$v.form.gameMinute.$model"
            type="number"
            :state="validateState('gameMinute')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.gameMinute.required">
            Minute is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.gameMinute.numeric">
            Minute must be numeric
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.gameMinute.minmax">
            Minute must be in range 0-120
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-eventType"
            label-cols-sm="3"
            label="Type:"
            label-for="eventType"
        >
            <b-form-select
            id="eventType"
            v-model="$v.form.eventType.$model"
            :options="eventTypes"
            :state="validateState('eventType')"
            ></b-form-select>
            <b-form-invalid-feedback v-if="!$v.form.eventType.required">
            Event Type is required
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            id="input-group-description"
            label-cols-sm="3"
            label="Description:"
            label-for="description"
        >
            <b-form-input
            id="description"
            v-model="$v.form.description.$model"
            type="text"
            :state="validateState('description')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.description.required">
            Description is required
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
        Game Event Addition failed: {{ form.submitError }}
        </b-alert>
    </div>
</template>

<script>
import {
  required,
  numeric,
  minValue,
  maxValue
} from "vuelidate/lib/validators";
import eventTypes from "../assets/events";
export default {
  name: "addevent",
  data() {
    return {
      form: {
        gameID: null,
        gameMinute: null,
        eventType: null,
        description: ""
      },
      eventTypes: [{ value: null, text: 'Choose Event...'}]
    };
  },
  validations: {
    form: {
      gameID: {
        required,
        numeric
      },
      gameMinute: {
        required,
        numeric,
        minmax: (gameMinute) => minValue(0)(gameMinute) && maxValue(120)(gameMinute)
      },
      eventType: {
        required
      },
      description: {
        required
      }
    }
  },
  mounted(){
    this.eventTypes.push(...eventTypes);
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async addGameEvent() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/associationRepresentatives/addEventToGame",
          {
            gameID: this.form.gameID,
            gameMinute: this.form.gameMinute,
            eventType: this.form.eventType,
            description: this.form.description,
          }
        );
        this.$root.toast("Add Event", "Game Event added successfully", "success");
        this.onReset();
      } catch (err) {
        this.form.submitError = err.response.data;
        this.$root.toast("Add Event", this.form.submitError, "failure");
      }
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.addGameEvent();
    },
    onReset() {
      this.form = {
        gameID: null,
        gameMinute: null,
        eventType: null,
        description: ""
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
