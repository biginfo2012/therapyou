<template>
  <v-container class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <transition appear name="fadeout">
          <v-card class="pa-2">
            <v-card-title primary-title>
              <div>
                <h4 class="headline mb-0">VERIFY</h4>
                <h4 class="subheading mb-0">your email address</h4>
              </div>
            </v-card-title>
            <v-card-text>
              <h4 class="subheading mb-0 accent--text">Re-send Confirmation Code</h4>
              <v-alert outlined type="error" dismissible class="mb-4 mt-2" v-model="showerr">
                {{ errmsg }}
              </v-alert>
              <v-form v-model="valid" ref="form">
                <v-text-field
                    label="E-mail"
                    v-model="email" outlined
                    :rules="[emailrules.required, emailrules.email]"
                    required clearable>
                </v-text-field>
              </v-form>
              <v-btn
                  block
                  :loading="loading"
                  @click.native="onSubmit()"
                  :disabled="!valid"
                  class="mt-3 mb-3 white--text"
                  color="success">
                Resend
                <span slot="loader">Connecting...</span>
              </v-btn>
            </v-card-text>
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

export default {
  name: "resend-confirm",
  data: () => ({
    userPool: [],
    cognitoUser: {},
    confirmed: false,
    showerr: false,
    errcode: '',
    errmsg: '',
    email: '',
    emailrules: {
      required: (value) => !!value || 'E-mail is required',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail must be valid'
      }
    },
    valid: false,
    loader: false,
    loading: false
  }),
  methods: {
    onSubmit () {
      this.loader = 'sending'
      const l = this.loader
      this[l] = !this[l]
      this.errcode = ''
      this.errmsg = ''
      this.showerr = false
      this.callback = false

      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.email,
        Pool: userPool
      }
      console.log('resending confirmation code to ' + userData.Username)
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          console.error('sending error: ' + JSON.stringify(err))
          this.errcode = JSON.stringify(err.code)
        } else {
          this.$store.commit('setUsername', this.email)
          console.log('sending success success: ' + JSON.stringify(result))
          router.push('/confirm')
        }
      })
    }
  },
  watch: {
    errcode () {
      this.loader = 'sending'
      const l = this.loader
      this[l] = !this[l]
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
      this[l] = false
      this.loader = null
    }
  },
  created () {
    this.email = this.$store.state.auth.username || ''
  }
}
</script>

<style scoped>

</style>