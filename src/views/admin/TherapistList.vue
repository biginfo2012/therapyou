<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <BaseCard :heading="$t('therapist.therapists')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading"
                        loading-text="Loading..." :footer-props="{'items-per-page-text':$t('general.per')}">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ $t('therapist.list') }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="1200px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('therapist.create') }}</v-btn>
                  </template>
                  <v-card>
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending"
                         style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px); z-index: 1"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                      <v-container class="pb-0">
                        <v-form ref="form">
                          <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                            {{ errmsg }}
                          </v-alert>
                          <v-row>
                            <v-col cols="12" sm="12" md="3" class="pb-0" v-if="editedIndex === -1">
                              <v-text-field
                                  v-model="editedItem.email"
                                  :rules="emailRules"
                                  required outlined
                                  :label="$t('login.email')"
                                  :disabled="editedIndex === -1 ? false : true"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.name"
                                  :rules="nameRules"
                                  outlined required
                                  :label="$t('therapist.name')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.surname"
                                  :rules="surnameRules"
                                  outlined required
                                  :label="$t('therapist.surname')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0" v-if="editedIndex === -1">
                              <v-text-field
                                  v-model="editedItem.phoneNumber"
                                  :rules="phoneRules"
                                  required outlined
                                  :label="$t('client.phone')"
                                  :disabled="editedIndex === -1 ? false : true"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.suffix"
                                  :rules="fieldRules"
                                  outlined required
                                  :label="$t('therapist.suffix')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.specialization"
                                  :rules="fieldRules"
                                  outlined required
                                  :label="$t('therapist.specialization')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.licenseNumber"
                                  :rules="fieldRules"
                                  outlined required
                                  :label="$t('therapist.license-number')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.registrationRegion"
                                  :rules="fieldRules"
                                  outlined required
                                  :label="$t('therapist.register-region')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.registrationDate"
                                  hide-details outlined
                                  disabled
                                  background-color="transparent"
                                  :label="$t('therapist.register-date')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" class="pb-0 pt-0 pr-0 text-center"
                                   v-if="editedIndex !== -1">
                              <img :src="editedItem.profileImage" style="width: auto; height: 59px; max-width: 100%;"/>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-file-input
                                  :label="$t('therapist.profile-image')" outlined
                                  @change="uploadProfileFile"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" class="pb-0 pt-0 pr-0 text-center"
                                   v-if="editedIndex !== -1">
                              <img :src="editedItem.bannerImage" style="width: auto; height: 59px; max-width: 100%;"/>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-file-input
                                  :label="$t('therapist.banner-image')" outlined
                                  @change="uploadBannerFile"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.vatNumber"
                                  :rules="fieldRules"
                                  outlined required
                                  :label="$t('therapist.vat-number')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-select
                                  v-model="editedItem.areasOfExpertise"
                                  :items="areas"
                                  :label="$t('therapist.area-exp')"
                                  multiple outlined
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
                                  >(+{{ editedItem.areasOfExpertise.length > 5 ? editedItem.areasOfExpertise.length - 5 : 0 }} others)</span>
                                </template>
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-textarea
                                  v-model="editedItem.description"
                                  :rules="fieldRules"
                                  outlined required auto-grow
                                  :label="$t('therapist.desc')"
                              ></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" class="pb-0 pt-0" v-if="editedIndex !== -1">
                              <v-textarea
                                  v-model="editedItem.note"
                                  :rules="fieldRules"
                                  outlined required auto-grow
                                  :label="$t('therapist.note')"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close" :disabled="sending">{{
                          $t('general.cancel')
                        }}
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save" :disabled="sending">{{
                          $t('general.save')
                        }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              {{ $t('general.no-data') }}
            </template>
          </v-data-table>
        </div>
      </div>
    </BaseCard>
  </v-container>
</template>

<script>

//import {poolData} from "@/constants/config"
import {dateFormatFit, getLoginInfo, singleUpload} from '@/utils'
import {deleteTherapist, getTherapistList, signUpTherapist, updateTherapist} from "@/api";
// var AmazonCognitoIdentity = require('amazon-cognito-identity-js')
//
// var userPool = []
// var attributeList = []
// var dataEmail = {
//   Name: 'email',
//   Value: ''
// }
// var dataPhone = {
//   Name: 'phone_number',
//   Value: ''
// }
export default {
  name: "TherapistList",
  data: function () {
    return {
      callback: false,
      showerr: false,
      errcode: '',
      errmsg: '',
      page: {
        title: this.$t('therapist.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('therapist.list'),
          disabled: false,
          to: "#",
        }
      ],
      dialog: false,
      loading: false,
      sending: false,
      items: [],
      areas: ["Stress", "Ansia", "Attacchi di panico", "Crisi esistenziale", "Depressione post partum", "Dipendenza sessuale", "Disturbi alimentari", "Disturbi di personalita", "Disturbo bipolare", "Disturbo post traumatico da stress", "Lutto", "Burn out", "Fobie", "Impotenza", "Insonnia", "Ipocondria", "Problemi adolescenziali", "Problemi relazionali", "Somatizzazione", "Tricotillomania", "Tic", "Stalking", "Problemi di coppia", "Nevrosi", "Paranoia", "Mobbing", "Ludopatia", "Frigidita", "Esaurimento nervoso", "Divorzio o separazione", "Disturbo ossessivo compulsivo", "Disturbo da alimentazione incontrollata", "Dipendenze comportamentali", "Dipendenza affettiva", "Depressione", "Bulimia", "Anoressia", "Aggressivita", "Balbuzie", "Anorgasmia"],
      headers: [
        // {
        //   text: this.$t('therapist.suffix'),
        //   align: "start",
        //   sortable: true,
        //   value: "suffix"
        // },
        {
          text: this.$t('therapist.name'),
          align: "start",
          sortable: true,
          value: "name"
        },
        {
          text: this.$t('therapist.surname'),
          align: "start",
          sortable: true,
          value: "surname"
        },
        {
          text: this.$t('therapist.specialization'),
          align: "start",
          sortable: true,
          value: "specialization"
        },
        {
          text: this.$t('therapist.license-number'),
          align: "start",
          sortable: true,
          value: "licenseNumber"
        },
        {
          text: this.$t('therapist.vat-number'),
          align: "start",
          sortable: true,
          value: "vatNumber"
        },
        {
          text: this.$t('therapist.register-region'),
          align: "start",
          sortable: true,
          value: "registrationRegion"
        },
        {
          text: this.$t('therapist.register-date'),
          align: "start",
          sortable: true,
          value: "registrationDate"
        },
        {text: this.$t('general.actions'), value: "actions", sortable: false}
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
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
      nameRules: [
        v => !!v || this.$t('error-messages.name-required'),
      ],
      surnameRules: [
        v => !!v || this.$t('error-messages.surname-required'),
      ],
      fieldRules: [
        v => !!v || this.$t('error-messages.field-required'),
      ],
      loginInfo: getLoginInfo()
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? this.$t('general.new') : this.$t('general.edit')
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    errcode() {
      console.log('watched error code: ' + this.errcode)
      if (this.errcode !== '') {
        if (this.errcode === '"UsernameExistsException"') {
          this.errmsg = this.$t('cognito-messages.UsernameExistsException')
        } else {
          this.errmsg = this.$t('error-messages.error')
        }
        this.showerr = true
      }
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.getData()
    },
    handle(error, isConfirm = false) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        if (isConfirm) {
          if (error.response.data.msg == "Error - Therapist has pending activity and cannot be deleted") {
            this.$dialog.notify.error(this.$t('message.therapist-error'))
          } else if (error.response.data.msg == "Error - Admin cannot delete himself") {
            console.log("ddd")
            this.$dialog.notify.error(this.$t('therapist.error-admin'))
          } else {
            this.$dialog.notify.error(error.response.data.msg)
          }
        }
      }
    },
    getData() {
      this.loading = true
      let data = {
        cognitoId: this.loginInfo.cognitoId,
      }
      this.datas = []
      getTherapistList(data).then((response) => {
        if (response.data.msg == "success") {
          let therapists = response.data.data.therapistList
          for (let i = 0; i < therapists.length; i++) {
            therapists[i]['registrationDate'] = dateFormatFit(therapists[i]['registrationDate'].substring(0, 10))
            therapists[i]['areasOfExpertise'] = JSON.parse(therapists[i]['areasOfExpertise'])
          }
          this.datas = response.data.data.therapistList
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })
    },
    editItem(item) {
      this.editedIndex = this.datas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem(item) {
      let res = await this.$dialog["warning"]({
        title: this.$t('general.confirm'),
        text: this.$t('therapist.delete-confirm'),
        actions: {
          false: this.$t('general.cancel'),
          true: "OK"
        },
        persistent: false
      })
      if (res) {
        let data = {
          therapistToDelete: item.cognitoId,
          adminId: this.loginInfo.cognitoId
        }
        deleteTherapist(data).then((response) => {
          if (response.data.msg == "success") {
            this.$dialog.notify.success(this.$t('message.delete-success'))
            this.getData()
          } else {
            console.log(response.data.msg)
            if (response.data.msg == "Error - Therapist has pending activity and cannot be deleted") {
              this.$dialog.notify.error(this.$t('message.therapist-error'))
            } else if (response.data.msg == "Error - Admin cannot delete himself") {
              console.log("ddd")
              this.$dialog.notify.error(this.$t('therapist.error-admin'))
            } else {
              this.$dialog.notify.error(response.data.msg)
            }

          }
        }).catch(error => {
          this.handle(error, true)
        })
      }
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {

      this.$refs.form.validate()
      if (this.$refs.form.validate(true)) {
        this.sending = true
        if (this.editedIndex > -1) {
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
              this.close()
              this.getData()
            } else {
              this.$dialog.notify.error(response.data.msg)
            }
          }).catch(error => {
            this.sending = false
            this.handle(error, true)
          })
        } else {
          let data = {
            email: this.editedItem.email,
            name: this.editedItem.name,
            surname: this.editedItem.surname,
            phone: this.editedItem.phoneNumber
          }

          signUpTherapist(data).then((response) => {
            this.sending = false
            if (response.data.msg == "success") {
              this.close()
              this.getData()
            } else {
              this.$dialog.notify.error(response.data.msg)
            }
          }).catch(error => {
            this.sending = false
            this.close()
            this.handle(error, true)
          })
        }
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
          console.log(result)
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
  }
}
</script>

<style>
.mdi-exclamation {
  display: none !important;
}
</style>