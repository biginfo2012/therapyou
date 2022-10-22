<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <v-card class="elevation-4">
          <v-row>
            <v-col lg="12">
              <div class="pa-7 pa-sm-12">
                <img src="@/assets/images/icons/logo-icon.png" width="64"/>
                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">{{ $t('login.login')}}</h2>
                <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                  {{ errmsg }}
                  <v-btn v-if="resend" color="primary" text small :to="'/resend'">{{ $t('login.resend') }}</v-btn>
                </v-alert>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      :label="$t('login.email')"
                      class="mt-4"
                      required
                      outlined></v-text-field>
                  <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      :label="$t('login.password')"
                      required
                      outlined
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"></v-text-field>
                  <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
                    <div class="ml-auto">
                      <a href="/forgot" class="link">{{$t('login.forgot')}}</a>
                    </div>
                  </div>
                  <v-btn
                      :disabled="!valid || loading"
                      color="success"
                      block
                      class="mr-4"
                      submit
                      @click="submit">{{ $t('login.login')}}</v-btn>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
        <img src="@/assets/images/icons/logo-icon.gif" width="80" class="middle" v-show="loading"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data: function () {
    return{
      callback: false,
      showerr: false,
      resend: false,
      errmsg: '',
      valid: true,
      password: "",
      show1: false,
      loading: false,
      passwordRules: [
        v => !!v || this.$t('error-messages.password-required'),
        v => (v && v.length >= 8) || this.$t('error-messages.password-length')
      ],
      email: "",
      emailRules: [
        v => !!v || this.$t('error-messages.email-required'),
        v => /.+@.+\..+/.test(v) || this.$t('error-messages.email-valid'),
      ],
      checkbox: false
    }
  },
  computed: {
    errcode: function () {
      return this.$store.state.auth.errcode
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$refs.form.validate()
      if (this.$refs.form.validate(true)) {
        var authData = {
          Username: this.email,
          Password: this.password
        }
        this.$store.dispatch('signIn', authData)
      }
      else{
        this.loading = false
      }
    }
  },
  watch: {
    errcode () {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        this.loading = false
        if (this.errcode === '"NotAuthorizedException"') {
          this.errmsg = this.$t('cognito-messages.NotAuthorizedException')
        } else if (this.errcode === '"UserNotFoundException"') {
          this.errmsg = this.$t('cognito-messages.UserNotFoundException')
        } else if (this.errcode === '"UserNotConfirmedException"') {
          this.$store.commit('setUsername', this.email)
          this.resend = true
          this.errmsg = this.$t('cognito-messages.UserNotConfirmedException')
        } else if (this.errcode === '"LimitExceededException"') {
          this.errmsg = this.$t('cognito-messages.LimitExceededException')
        } else {
          this.errmsg = this.$t('error-messages.error')
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
.middle{
  position: absolute;
  left: calc(50% - 40px);
  top: calc(50% - 40px);
}
</style>