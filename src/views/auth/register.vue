<template>
  <v-row>
    <v-col cols="12" lg="7" xl="6" class="info d-none d-md-flex align-center justify-center">
      <v-container>
        <div class="pa-10">
          <v-row justify="center">
            <v-col cols="8" xl="5">
              <div>
                <h2
                    class="display-1 white--text font-weight-medium"
                >Dashboard</h2>
                <h6
                    class="subtitle-1 mt-4 white--text op-5 font-weight-regular"
                >In order to avoid some manual
                  operations that generate errors and improve the quality of the service by keeping the
                  therapists focused on their patients.</h6>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <v-col cols="12" lg="5" xl="6" class="d-flex align-center">
      <v-container>
        <div class="pa-7 pa-sm-12">
          <v-row>
            <v-col cols="12" lg="12" xl="8">
              <img src="@/assets/images/logo-icon.png" />
              <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Sign Up</h2>
              <h6 class="subtitle-1">
                Do you have an account?
                <a href="/login" class>Sign in</a>
              </h6>

              <v-form ref="form" v-model="valid">
                <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                  {{ errmsg }}
                </v-alert>
                <v-row>
                  <v-col cols="12" lg="12" xl="12">
                    <v-text-field v-model="phone" :rules="phoneRules" label="Phone Number" required outlined></v-text-field>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required outlined></v-text-field>

                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        required
                        outlined
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                    ></v-text-field>
                  </v-col>          
                </v-row>


                <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
                  <v-checkbox
                      v-model="checkbox"
                      :rules="[v => !!v || 'You must agree to continue!']"
                      label="I agree to the terms and privacy"
                      required
                  ></v-checkbox>
                </div>
                <v-btn
                    :disabled="!valid"
                    color="info"
                    block
                    class="mr-4"
                    submit
                    @click="submit"
                >Sign Up</v-btn>
              </v-form>
            </v-col>

          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import router from '@/router/router'
import {poolData} from "@/constants/config"
var AmazonCognitoIdentity = require('amazon-cognito-identity-js')

var userPool = []
var attributeList = []
var dataEmail = {
  Name: 'email',
  Value: ''
}
var dataPhone = {
  Name: 'phone_number',
  Value: ''
}

export default {
  name: "Register",
  data: () => ({
    password: "",
    show1: false,
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => !v || v.length >= 8 || 'Password must be 8-20 characters',
      (v) => /^(?=.*[0-9])/.test(v) || 'Password must contain at least 1 number',
      (v) => /^(?=.*[a-z])/.test(v) || 'Password must contain at least 1 lower case letter',
      (v) => /^(?=.*[A-Z])/.test(v) || 'Password must contain at least 1 upper case letter',
      (v) => /^(?=.*[!@#$%^&*"])/.test(v) || 'Password must contain at least 1 special character (!@#$%^&*")'
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    phone: "",
    phoneRules:[
      v => !!v || "Phone Number is required",
    ],
    valid: false,
    checkbox: false,
    callback: false,
    showerr: false,
    errcode: '',
    errmsg: '',
  }),
  methods: {
    submit() {
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        dataEmail.Value = this.email
        dataPhone.Value = this.phone
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
        var attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone)
        attributeList.push(attributeEmail)
        attributeList.push(attributePhone)
        console.log('attribute list: ' + attributeList)
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
        console.log('sign up with: ' + this.email + ' ' + this.password)
        this.callback = false
        this.errcode = ''

        userPool.signUp(this.email, this.password, attributeList, null, (err, result) => {
          if (!this.callback) {
            this.callback = true
            console.log('register callback')
            if (err) {
              console.error('registration error: ' + JSON.stringify(err))
              this.errcode = JSON.stringify(err.code)
            } else {
              console.log('registration success: ' + JSON.stringify(result))
              this.message = JSON.stringify(result.message)
              console.log('user name is ' + result.user.getUsername())
              this.$store.commit('setUsername', result.user.getUsername())
              router.push('/confirm')
            }
          }
        })
      }
    },
    getMessage: function () {
      return this.message
    }
  },
  watch: {
    errcode () {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        if (this.errcode === '"UsernameExistsException"') {
          this.errmsg = 'An account with the given email already exists!'
        } else {
          this.errmsg = 'An error has occured!'
        }
        this.showerr = true
      }
    }
  }
};
</script>
