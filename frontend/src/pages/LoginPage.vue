<template>
  <div class="container">
    <h1 class="title">Login Here:</h1>
    <b-form @submit.prevent="onLogin">
      <b-form-group
        id="input-group-Username"
        label-cols-sm="3"
        label="Username:"
        label-for="Username"
      >
        <b-form-input
          id="Username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Username is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="Password"
      >
        <b-form-input
          id="Password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Password is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        class="mx-autow-100"
        >Login</b-button
      >
      <div class="mt-2">
        Do not have an account yet?
        <router-link to="register"> Register here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Login failed: {{ form.submitError }}
    </b-alert>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined
      }
    };
  },
  validations: {
    form: {
      username: {
        required, 
      },
      password: {
        required
      }
    }
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async isAssoRep(){
      try{
        const response = await this.axios.get(
          "http://localhost:3000/users/isAssoRep"
        );
        if(response.data){
          return 'true';
        }
        else{
          return 'false';
        }
      }
      catch (err){
        return 'false';
      }
    },
    async Login() {
      try {
        const response = await this.axios.post(
          "http://localhost:3000/Login",
          {
            username: this.form.username,
            password: this.form.password
          }
        );
        const isAssoRep = await this.isAssoRep();
        this.$root.store.login(this.form.username, isAssoRep);
        this.$root.toast("Login", "You have successfully logged in!", "success");
        this.$router.push("/").catch(() => {
        this.$forceUpdate();
      });
      } catch (err) {
        console.log(err.response);
        this.form.submitError = err.response.data;
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.Login();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 400px;
}

.mx-autow-100{
  width: 40%;
  margin-left: 40%;
  background-color: #42b983!important;
  border-color: #42b983!important;
}

.title{
  text-align: center;
  margin-top: 17%;
  margin-left: 17%;
  margin-bottom: 5%;
}

.mt-2{
  text-align: center;
  margin-left: 30%;
}
</style>
