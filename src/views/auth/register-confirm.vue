<template>
  <v-container class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <transition appear name="fadeout">
          <v-card class="pa-2">
            <v-card-title primary-title>
              <div>
                <h4 class="headline mb-0">CONFIRM</h4>
                <h4 class="subheading mb-0">registration to Election App</h4>
              </div>
            </v-card-title>
            <v-card-text>
              <h4 class="subheading mb-0 accent--text">Enter Confirmation Code</h4>
              <h6 class="caption mb-2">A confirmation code was sent to your SMS</h6>
              <v-alert outlined type="error" dismissible class="mb-4 mt-2" v-model="showerr">
                {{ errmsg }}
              </v-alert>
              <v-form v-model="valid" ref="form">
                <v-text-field
                    label="Confirmation Code"
                    v-model="code"
                    :rules="codeRules"
                    required clearable>
                </v-text-field>
              </v-form>
              <v-btn
                  block
                  :loading="loading"
                  @click.native="onSubmit()"
                  :disabled="!valid"
                  class="mt-3 mb-3 white--text"
                  color="info">
                Confirm
                <span slot="loader">Connecting...</span>
              </v-btn>
            </v-card-text>
            <v-card-actions class="ml-2 mb-2">
              <v-btn text small :to="'/resend'">Re-send Confirmation</v-btn>
            </v-card-actions>
          </v-card>
        </transition>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import router from '@/router/router'
import {poolData} from "@/constants/config"
var AmazonCognitoIdentity = require('amazon-cognito-identity-js')
var userPool = []
export default {
  name: "register-confirm",
  data: () => ({
    callback: false,
    confirmed: false,
    showerr: false,
    errcode: '',
    errmsg: '',
    valid: false,
    code: '',
    codeRules: [
      (v) => !!v || 'Code is required'
    ],
    loader: false,
    loading: false
  }),
  methods: {
    onSubmit () {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]
      this.errcode = ''
      this.errmsg = ''
      this.showerr = false
      this.callback = false

      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.$store.state.auth.username,
        Pool: userPool
      }
      console.log('confirmation code for ' + userData.Username + ': ' + this.code)
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

      cognitoUser.confirmRegistration(this.code, true, (err, result) => {
        if (!this.callback) {
          this.callback = true
          console.log('confirm callback')
          if (err) {
            console.error('confirmation error: ' + JSON.stringify(err))
            this.errcode = JSON.stringify(err.code)
          } else {
            console.log('confirmation success: ' + JSON.stringify(result))
            this.confirmed = true
          }
          this[l] = false
          this.loader = null
        }
      })
    }
  },
  watch: {
    confirmed () {
      if (this.confirmed === true) {
        router.push('/registered')
      }
    },
    errcode () {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        if (this.errcode === '"CodeMismatchException"') {
          this.errmsg = 'Invalid verification code provided'
        } else if (this.errcode === '"NotAuthorizedException"') {
          this.errmsg = 'The user has already been confirmed'
        } else if (this.errcode === '"UserNotFoundException"') {
          this.errmsg = 'Username id not found!'
        } else if (this.errcode === '"LimitExceededException"') {
          this.errmsg = 'Attempt limit exceeded, please try after some time'
        } else {
          this.errmsg = 'An error has occured!'
        }
        this.showerr = true
      }
    }
  },
  created () {
    this.email = this.$store.state.auth.username
  }
}
</script>

<style scoped>

</style>