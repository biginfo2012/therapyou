<template>
  <v-container class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <transition appear name="fadeout">
          <v-card class="pa-2">
            <v-card-title primary-title>
              <div>
                <h4 class="headline mb-0">{{ $t('forgot.reset') }}</h4>
              </div>
            </v-card-title>
            <v-card-text>
              <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                {{ errmsg }}
              </v-alert>
              <v-alert outlined type="success" dismissible class="mb-4 mt-0" v-model="showsent">
                {{ $t('forgot.show-sent') }}
              </v-alert>
              <div v-show="!codesent">
                <h4 class="subheading mb-2">{{ $t('forgot.find-account') }}</h4>
                <v-form  v-model="validemail">
                  <v-text-field
                      autocomplete="username"
                      :label="$t('login.email')"
                      v-model="username"
                      :rules="emailRules" outlined
                      required clearable>
                  </v-text-field>
                </v-form>
                <v-btn
                    block
                    :loading="loading"
                    @click.native="onFind()"
                    :disabled="!validemail"
                    class="mt-3 mb-3"
                    color="success">
                  {{ $t('forgot.find') }}
                  <span slot="loader"> {{ $t('forgot.verify-account') }}</span>
                </v-btn>
                <div class="accent--text">
                  {{ $t('forgot.send-code') }}
                </div>
              </div>
              <div v-show="codesent">
                <h4 class="subheading mb-2 accent--text"> {{ $t('forgot.confirm-pwd') }}</h4>
                <v-form v-model="validcode" ref="form">
                  <v-text-field
                      :label="$t('forgot.confirm-code')"
                      v-model="code"
                      :rules="codeRules" outlined
                      required clearable>
                  </v-text-field>
                  <v-text-field
                      autocomplete="new-password"
                      :label="$t('forgot.new-pwd')"
                      v-model="password" outlined
                      :rules="passRules"
                      :append-icon="hidepw ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="hidepw ? 'password' : 'text'"
                      required>
                  </v-text-field>
                </v-form>
                <v-btn
                    block
                    :loading="loading"
                    @click.native="onSubmit()"
                    :disabled="!validcode"
                    class="mt-3 mb-3"
                    color="success">
                  {{ $t('forgot.confirm') }}
                  <span slot="loader">{{ $t('forgot.update-pwd') }}</span>
                </v-btn>
              </div>
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
var userPool = []
export default {
  name: "forgot",
  data: function () {
    return {
      codesent: false,
      callback: false,
      showerr: false,
      showsent: false,
      errcode: '',
      errmsg: '',
      validemail: false,
      validcode: false,
      username: '',
      emailRules: [
        (v) => !!v || this.$t('error-messages.email-required'),
        // eslint-disable-next-line
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('error-messages.email-valid')
      ],
      password: '',
      passRules: [
        (v) => !!v || this.$t('error-messages.password-required'),
        (v) => !v || v.length >= 8 || this.$t('error-messages.password-length'),
        (v) => /^(?=.*[0-9])/.test(v) || this.$t('error-messages.password-number'),
        (v) => /^(?=.*[a-z])/.test(v) || this.$t('error-messages.password-lower'),
        (v) => /^(?=.*[A-Z])/.test(v) || this.$t('error-messages.password-upper'),
        (v) => /^(?=.*[!@#$%^&*"])/.test(v) || this.$t('error-messages.password-special'),
      ],
      code: '',
      codeRules: [
        (v) => !!v || this.$t('error-messages.code-required'),
      ],
      hidepw: true,
      loader: false,
      loading: false
    }
  },
  methods: {
    onSubmit () {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]

      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.username,
        Pool: userPool
      }
      console.log('password change for ' + userData.Username)
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      this.showerr = false
      this.showsent = false
      this.errcode = ''

      cognitoUser.confirmPassword(this.code, this.password, {
        onSuccess: (data) => {
          console.log('forgot password confirmed: ' + JSON.stringify(data))
          this[l] = false
          this.loader = null
          router.push('/changed')
        },
        onFailure: (err) => {
          var code = JSON.stringify(err.code)
          console.log('forgot password confirm error: ' + code)
          this.errcode = code
          this[l] = false
          this.loader = null
        }
      })
    },
    onFind () {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]

      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.username,
        Pool: userPool
      }
      console.log('password forgot for ' + userData.Username)
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      this.showerr = false
      this.errcode = ''

      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          console.log('forgot password initiated: ' + JSON.stringify(data))
          this[l] = false
          this.loader = null
        },
        onFailure: (err) => {
          var code = JSON.stringify(err.code)
          console.error('forgot password error: ' + code)
          this.errcode = code
          this[l] = false
          this.loader = null
        },
        inputVerificationCode: (data) => {
          var result = JSON.stringify(data)
          console.log('Code sent to: ' + result)
          this.codesent = true
          this.showsent = true
          this.valid = false
          this[l] = false
          this.loader = null
        }
      })
    }
  },
  watch: {
    errcode () {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        if (this.errcode === '"CodeMismatchException"') {
          this.errmsg = this.$t('cognito-messages.CodeMismatchException')
        } else if (this.errcode === '"NotAuthorizedException"') {
          this.errmsg = this.$t('cognito-messages.NotAuthorizedException')
        } else if (this.errcode === '"UserNotFoundException"') {
          this.errmsg = this.$t('cognito-messages.UserNotFoundException')
        } else if (this.errcode === '"LimitExceededException"') {
          this.errmsg = this.$t('cognito-messages.LimitExceededException')
        } else if (this.errcode === '"UserNotConfirmedException"') {
          this.errmsg = this.$t('cognito-messages.UserNotConfirmedException')
        } else {
          this.errmsg = this.$t('error-messages.error')
        }
        this.showerr = true
      }
    }
  }
}
</script>

<style scoped>

</style>