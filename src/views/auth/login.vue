<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <v-card class="elevation-4">
          <v-row>
            <v-col lg="12">
              <div class="pa-7 pa-sm-12">
                <img src="@/assets/images/logo-icon.png" />
                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Sign in</h2>
                <h6 class="subtitle-1">
                  Don't have an account?
                  <a href="/register" class>Sign Up</a>
                </h6>
                <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                  {{ errmsg }}
                  <v-btn v-if="resend" color="primary" text small :to="'/resend'">Re-send Confirmation</v-btn>
                </v-alert>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      class="mt-4"
                      required
                      outlined
                  ></v-text-field>
                  <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="Password"
                      required
                      outlined
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                  ></v-text-field>

                  <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
<!--                    <v-checkbox-->
<!--                        v-model="checkbox"-->
<!--                        :rules="[v => !!v || 'You must agree to continue!']"-->
<!--                        label="Remember me?"-->
<!--                        required-->
<!--                    ></v-checkbox>-->
                    <div class="ml-auto">
                      <a href="/forgot" class="link">Forgot pwd?</a>
                    </div>
                  </div>
                  <v-btn
                      :disabled="!valid"
                      color="info"
                      block
                      class="mr-4"
                      submit
                      @click="submit"
                  >Sign In</v-btn>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data: () => ({
    callback: false,
    showerr: false,
    resend: false,
    errmsg: '',
    valid: true,
    password: "",
    show1: false,
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 8) || 'Password must be at least 8 characters'
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    checkbox: false
  }),
  computed: {
    errcode: function () {
      return this.$store.state.auth.errcode
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        var authData = {
          Username: this.email,
          Password: this.password
        }
        this.$store.dispatch('signIn', authData)
        //this.$router.push({ path: "/dashboard" });
      }
    }
  },
  watch: {
    errcode () {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        if (this.errcode === '"NotAuthorizedException"') {
          this.errmsg = 'Incorrect username or password'
        } else if (this.errcode === '"UserNotFoundException"') {
          this.errmsg = 'User not found'
        } else if (this.errcode === '"UserNotConfirmedException"') {
          this.$store.commit('setUsername', this.email)
          this.resend = true
          this.errmsg = 'User registration not confirmed'
        } else if (this.errcode === '"LimitExceededException"') {
          this.errmsg = 'Attempt limit exceeded, please try after some time'
        } else {
          this.errmsg = 'An error has occured!'
        }
        this.showerr = true
      } else {
        this.showerr = false
      }
    }
  }
}
</script>

<style scoped>

</style>