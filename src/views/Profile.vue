<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" lg="12">
        <v-card class="mb-7">
          <v-card-text class="pa-5 border-bottom">
            <h3 class="title blue-grey--text text--darken-2 font-weight-regular">{{ $t('profile.profile') }}</h3>
            <h3 class="subtitle blue-grey--text text--darken-2 font-weight-regular mt-3">{{
                $t('profile.personal-info')
              }}</h3>
          </v-card-text>
          <v-card-text class="pa-5 border-bottom position-relative">
            <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending"
                 style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px); z-index: 1"/>
            <v-form ref="profileForm">
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">
                {{ $t('profile.personal-info') }}</h3>
              <v-row>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.suffix"
                      :rules="fieldRules"
                      outlined required
                      :label="$t('therapist.suffix')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.name"
                      :rules="fieldRules"
                      outlined required
                      :label="$t('therapist.name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.surname"
                      :rules="fieldRules"
                      outlined required
                      :label="$t('therapist.surname')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.specialization"
                      :rules="fieldRules"
                      outlined required
                      :label="$t('therapist.specialization')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.licenseNumber"
                      :rules="numberRules"
                      outlined required
                      :label="$t('therapist.license-number')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.registrationRegion"
                      :rules="fieldRules"
                      outlined required
                      :label="$t('therapist.register-region')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0 pt-0">
                  <v-text-field
                      v-model="editedItem.registrationDate"
                      type="date"
                      hide-details outlined disabled
                      background-color="transparent"
                      :label="$t('therapist.register-date')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="1" class="pb-0 pt-0 pr-0">
                  <img :src="editedItem.profileImage" style="width: auto; height: 59px"/>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="pb-0 pt-0">
                  <v-file-input
                      :label="$t('therapist.profile-image')" outlined
                      @change="uploadProfileFile"></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="1" class="pb-0 pt-0 pr-0">
                  <img :src="editedItem.bannerImage" style="width: auto; height: 59px"/>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="pb-0 pt-0">
                  <v-file-input
                      :label="$t('therapist.banner-image')" outlined
                      @change="uploadBannerFile"></v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="pb-0">
                  <v-text-field
                      v-model="editedItem.vatNumber"
                      :rules="numberRules"
                      outlined required
                      :label="$t('therapist.vat-number')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="8" class="pb-0">
                  <v-select
                      v-model="editedItem.areasOfExpertise"
                      :items="areas"
                      :label="$t('therapist.area-exp')"
                      multiple outlined required
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0">
                        <span>{{ item }}</span>
                      </v-chip>
                      <v-chip v-if="index === 1">
                        <span>{{ item }}</span>
                      </v-chip>
                      <v-chip v-if="index === 2">
                        <span>{{ item }}</span>
                      </v-chip>
                      <v-chip v-if="index === 3">
                        <span>{{ item }}</span>
                      </v-chip>
                      <v-chip v-if="index === 4">
                        <span>{{ item }}</span>
                      </v-chip>
                      <span
                          v-if="index === 5"
                          class="grey--text caption"
                      >(+{{ editedItem.areasOfExpertise.length > 5 ? editedItem.areasOfExpertise.length - 5 : 0}} others)</span>
                    </template>
                  </v-select>
<!--                  <v-autocomplete-->
<!--                      v-model="editedItem.areasOfExpertise"-->
<!--                      :items="areas"-->
<!--                      :menu-props="{ maxHeight: '400' }"-->
<!--                      :label="$t('therapist.area-exp')"-->
<!--                      multiple outlined required-->
<!--                      persistent-hint-->
<!--                  ></v-autocomplete>-->
                </v-col>
                <v-col cols="12" sm="12" md="6" class="pb-0">
                  <v-textarea
                      v-model="editedItem.description"
                      :rules="fieldRules"
                      outlined required auto-grow
                      :label="$t('therapist.desc')"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="6" class="pb-0">
                  <v-textarea
                      v-model="editedItem.note"
                      :rules="fieldRules"
                      outlined required auto-grow
                      :label="$t('therapist.note')"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
            <div class="pa-5 border-top text-right">
              <v-btn color="success" class="mr-2 text-capitalize" :disabled="sending" @click="profileChange">
                {{ $t('general.edit') }}
              </v-btn>
            </div>
          </v-card-text>
          <v-card-text class="pa-5" v-show="!codesent">
            <h3 class="title blue-grey--text text--darken-2 font-weight-regular">{{ $t('profile.contact-info') }}</h3>
            <v-alert outlined type="error" dismissible class="mb-0 mt-4" v-model="showerr">
              {{ errmsg }}
            </v-alert>
            <v-row>
              <v-col cols="12" sm="12" md="6" class="pb-0">
                <v-text-field
                    v-model="editedItem.email"
                    :rules="emailRules" style="color: black !important;"
                    required outlined disabled
                    :label="$t('login.email')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="pb-0">
                <v-text-field
                    v-model="editedItem.phoneNumber"
                    :rules="phoneRules" style="color: black !important;"
                    required outlined disabled
                    :label="$t('client.phone')"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="pa-5 border-top text-right">
              <v-btn color="success" class="mr-2 text-capitalize" @click="sendCode" :loading="loading">
                {{ $t('general.change-password') }}
                <span slot="loader"> {{ $t('forgot.send-code') }}</span>
              </v-btn>
              <div class="accent--text">
                {{ $t('forgot.code-send') }}
              </div>
            </div>
          </v-card-text>
          <v-card-text class="pa-5" v-show="codesent">
            <v-form ref="codeForm" v-model="validcode">
              <h3 class="title blue-grey--text text--darken-2 font-weight-regular">{{ $t('forgot.confirm-pwd') }}</h3>
              <v-alert outlined type="error" dismissible class="mb-0 mt-4" v-model="showerr">
                {{ errmsg }}
              </v-alert>
              <v-alert outlined type="success" dismissible class="mb-0 mt-4" v-model="showsent">
                {{ $t('forgot.show-sent') }}
              </v-alert>
              <v-row>
                <v-col cols="12" sm="12" md="6" class="pb-0">
                  <v-text-field
                      :label="$t('forgot.confirm-code')"
                      v-model="code"
                      :rules="codeRules"
                      outlined required clearable>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6" class="pb-0">
                  <v-text-field
                      autocomplete="new-password"
                      :label="$t('forgot.new-pwd')"
                      v-model="password"
                      :rules="passwordRules"
                      :append-icon="hidepw ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="hidepw ? 'password' : 'text'"
                      outlined required>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <div class="pa-5 border-top text-right">
              <v-btn color="success" class="mr-2 text-capitalize" :disabled="!validcode" :loading="loading" @click="passwordChange">
                {{ $t('forgot.confirm') }}
                <span slot="loader">{{ $t('forgot.update-pwd') }}</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {getLoginInfo, singleUpload} from "@/utils"
import {updateTherapist} from "@/api";
import {poolData} from "@/constants/config"

var AmazonCognitoIdentity = require('amazon-cognito-identity-js')
var userPool = []
export default {
  name: "Profile",
  data: function () {
    return {
      codesent: false,
      callback: false,
      showerr: false,
      showsent: false,
      validcode: false,
      errcode: '',
      errmsg: '',
      page: {
        title: this.$t('profile.profile'),
      },
      breadcrumbs: [
        {
          text: this.$t('profile.profile'),
          disabled: false,
          to: "#",
        }
      ],
      areas: ["Stress", "Ansia", "Attacchi di panico", "Crisi esistenziale", "Depressione post partum", "Dipendenza sessuale", "Disturbi alimentari", "Disturbi di personalita",
        "Disturbo bipolare", "Disturbo post traumatico da stress", "Lutto", "Burn out", "Fobie", "Impotenza", "Insonnia", "Ipocondria", "Problemi adolescenziali",
        "Problemi relazionali", "Somatizzazione", "Tricotillomania", "Tic", "Stalking", "Problemi di coppia", "Nevrosi", "Paranoia", "Mobbing", "Ludopatia", "Frigidita",
        "Esaurimento nervoso", "Divorzio o separazione", "Disturbo ossessivo compulsivo", "Disturbo da alimentazione incontrollata", "Dipendenze comportamentali",
        "Dipendenza affettiva", "Depressione", "Bulimia", "Anoressia", "Aggressivita", "Balbuzie", "Anorgasmia"],
      sending: false,
      editedItem: getLoginInfo(),
      defaultItem: {
        cognitoId: "",
        email: "",
        phoneNumber: "",
        password: "",
        suffix: "",
        name: "",
        surname: "",
        specialization: "",
        licenseNumber: "",
        registrationRegion: "",
        registrationDate: "",
        vatNumber: "",
        profileImage: "",
        bannerImage: "",
        description: "",
        note: "",
        areasOfExpertise: [],
        role: 1,
        isDefault: 0
      },
      emailRules: [
        v => !!v || this.$t('error-messages.email-required'),
        v => /.+@.+\..+/.test(v) || this.$t('error-messages.email-valid'),
      ],
      numberRules: [
        v => !!v || this.$t('error-messages.field-required'),
        v => /^\d+$/.test(v) || this.$t('error-messages.number'),
      ],
      password: "",
      passwordRules: [
        (v) => !!v || this.$t('error-messages.password-required'),
        (v) => !v || v.length >= 8 || this.$t('error-messages.password-length'),
        (v) => /^(?=.*[0-9])/.test(v) || this.$t('error-messages.password-number'),
        (v) => /^(?=.*[a-z])/.test(v) || this.$t('error-messages.password-lower'),
        (v) => /^(?=.*[A-Z])/.test(v) || this.$t('error-messages.password-upper'),
        (v) => /^(?=.*[!@#$%^&*"])/.test(v) || this.$t('error-messages.password-special'),
      ],
      phoneRules: [
        v => !!v || this.$t('error-messages.phone-required'),
      ],
      fieldRules: [
        v => !!v || this.$t('error-messages.field-required'),
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
  watch: {
    errcode() {
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
  },
  created() {
    this.editedItem.registrationDate = this.editedItem.registrationDate.substring(0, 10)
    this.editedItem.areasOfExpertise = JSON.parse(this.editedItem.areasOfExpertise)
    this.editedItem.email = localStorage.getItem('username')
    this.editedItem.phoneNumber = localStorage.getItem('phoneNumber')
  },
  methods: {
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        this.$dialog.notify.error(error.response.data.msg)
      }
    },
    async uploadBannerFile(file) {
      if (file != undefined) {
        const result = await singleUpload(
            file,
            'invoices' // folder of the file, you should change it to your variable or a string
        )
        if (result.status === 200) {
          // Handle storing it to your database here
          this.editedItem.bannerImage = result.fullPath
        } else {
          this.$dialog.notify.error("File Upload to S3 failed")
        }
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            // Let FilePond know the request has been cancelled
            this.$dialog.notify.error("File Upload to S3 aborted")
          },
        }
      }

    },
    async uploadProfileFile(file) {
      if (file != undefined) {
        const result = await singleUpload(
            file,
            'invoices' // folder of the file, you should change it to your variable or a string
        )
        if (result.status === 200) {
          // Handle storing it to your database here
          this.editedItem.profileImage = result.fullPath
        } else {
          this.$dialog.notify.error("File Upload to S3 failed")
        }
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            // Let FilePond know the request has been cancelled
            this.$dialog.notify.error("File Upload to S3 aborted")
          },
        }
      }

    },
    profileChange() {
      this.$refs.profileForm.validate()
      if (this.$refs.profileForm.validate(true)) {
        this.sending = true
        let data = {
          cognitoId: this.editedItem.cognitoId,
          parameters: {
            suffix: this.editedItem.suffix,
            name: this.editedItem.name,
            surname: this.editedItem.surname,
            specialization: this.editedItem.specialization,
            licenseNumber: this.editedItem.licenseNumber,
            registrationRegion: this.editedItem.registrationRegion,
            registrationDate: this.editedItem.registrationDate,
            vatNumber: this.editedItem.vatNumber,
            profileImage: this.editedItem.profileImage,
            bannerImage: this.editedItem.bannerImage,
            description: this.editedItem.description,
            note: this.editedItem.note,
            areasOfExpertise: JSON.stringify(this.editedItem.areasOfExpertise)
          }
        }
        updateTherapist(data).then((response) => {
          this.sending = false
          if (response.data.msg == "success") {
            this.$dialog.notify.success(this.$t('message.save-success'))
            localStorage.setItem('userData', JSON.stringify(this.editedItem))
            window.location.reload()
          }
        }).catch(error => {
          this.sending = false
          this.handle(error)
        })
      }
    },
    sendCode () {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]

      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.editedItem.email,
        Pool: userPool
      }
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
    },
    passwordChange () {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]

      userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      var userData = {
        Username: this.editedItem.email,
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
  }
}
</script>

<style scoped>

</style>