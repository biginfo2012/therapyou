<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('client.clients')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-container>
            <v-form ref="search_form">
              <v-row>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-text-field
                      v-model="searchItem.firstName"
                      outlined
                      :label="$t('client.first-name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-text-field
                      v-model="searchItem.lastName"
                      outlined
                      :label="$t('client.last-name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-text-field
                      v-model="searchItem.credits"
                      outlined
                      :label="$t('client.credits')"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-text-field
                      v-model="searchItem.email"
                      outlined
                      :label="$t('login.email')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-text-field
                      v-model="searchItem.phoneNumber"
                      outlined
                      :label="$t('client.phone')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-btn color="success" class="mt-3 mr-3" @click="reset">{{ $t('general.reset') }}</v-btn>
                  <v-btn color="success" class="mt-3" @click="getData">{{ $t('general.search') }}</v-btn>
                </v-col>
              </v-row>
            </v-form>

          </v-container>
          <v-data-table :headers="headers" :items="listData" sort-by="calories" class="border" :loading="loading"
                        loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>{{ $t('client.my') }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="1000px">
                  <v-card>
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending"
                         style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text class="pb-0">
                      <v-container>
                        <v-form ref="form">
                          <v-alert outlined type="error" dismissible class="mb-4 mt-0" v-model="showerr">
                            {{ errmsg }}
                          </v-alert>
                          <v-row>
                            <v-col cols="12" sm="12" md="4" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.firstName"
                                  :rules="firstRules"
                                  required outlined
                                  :label="$t('client.first-name')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.lastName"
                                  :rules="lastRules"
                                  required outlined
                                  :label="$t('client.last-name')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0" v-if="editedIndex !== -1">
                              <v-text-field
                                  v-model="editedItem.credits"
                                  outlined
                                  :label="$t('client.credits')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.email"
                                  :rules="emailRules"
                                  required outlined
                                  :label="$t('login.email')"
                                  :disabled="editedIndex === -1 ? false : true"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.phoneNumber"
                                  :rules="phoneRules"
                                  required outlined
                                  :label="$t('client.phone')"
                                  :disabled="editedIndex === -1 ? false : true"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="pb-0" v-if="editedIndex === -1">
                              <v-text-field
                                  v-model="editedItem.password"
                                  :rules="passwordRules"
                                  outlined required
                                  :disabled="editedIndex === -1 ? false : true"
                                  :label="$t('login.password')"
                                  type="password"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="px-10 pb-3">
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close" :disabled="sending">{{ $t('general.cancel') }}</v-btn>
                      <v-btn color="blue darken-1" text @click="save" :disabled="sending">{{ $t('general.save') }}</v-btn>
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
              <v-btn color="success" @click="getData">{{ $t('general.reset') }}</v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </BaseCard>
  </v-container>
</template>

<script>
import {getLoginInfo} from '@/utils'
import {poolData} from "@/constants/config"
import {deleteUser, getUserList, initUser, updateUser} from "@/api"

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
  name: "ClientList",
  data: function () {
    return {
      callback: false,
      showerr: false,
      errcode: '',
      errmsg: '',
      page: {
        title: this.$t('client.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('client.list'),
          disabled: false,
          to: "#",
        }
      ],
      dialog: false,
      loading: false,
      sending: false,
      headers: [
        {
          text: this.$t('client.first-name'),
          align: "start",
          sortable: true,
          value: "firstName"
        },
        {
          text: this.$t('client.last-name'),
          align: "start",
          sortable: true,
          value: "lastName"
        },
        {
          text: this.$t('client.credits'),
          align: "start",
          sortable: true,
          value: "credits"
        },
        {
          text: this.$t('login.email'),
          align: "start",
          sortable: true,
          value: "email"
        },
        {
          text: this.$t('client.phone'),
          align: "start",
          sortable: true,
          value: "phoneNumber"
        },
        {text: this.$t('general.actions'), value: "actions", sortable: false}
      ],
      listData: [],
      editedIndex: -1,
      searchItem: {
        firstName: "",
        lastName: "",
        email: "",
        credits: null,
        phoneNumber: ""
      },
      editedItem: {
        cognitoId: "",
        firstName: "",
        lastName: "",
        email: "",
        credits: null,
        phoneNumber: "",
        password: ""
      },
      defaultItem: {
        cognitoId: "",
        firstName: "",
        lastName: "",
        email: "",
        credits: null,
        phoneNumber: "",
        password: ""
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
      firstRules: [
        v => !!v || this.$t('error-messages.first-required'),
      ],
      lastRules: [
        v => !!v || this.$t('error-messages.last-required'),
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
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getData() {
      this.loading = true
      let filter = {}
      if (this.searchItem.firstName != "") {
        filter.firstName = this.searchItem.firstName
      }
      if (this.searchItem.lastName != "") {
        filter.lastName = this.searchItem.lastName
      }
      if (this.searchItem.credits != null) {
        filter.credits = this.searchItem.credits
      }
      if (this.searchItem.email != "") {
        filter.email = this.searchItem.email
      }
      if (this.searchItem.phoneNumber != "") {
        filter.phoneNumber = this.searchItem.phoneNumber
      }
      let data = {
        cognitoId: this.loginInfo.cognitoId,
      }
      if (filter != {}) {
        data = {
          cognitoId: this.loginInfo.cognitoId,
          filters: filter
        }
      }

      getUserList(data).then((response) => {
        if (response.data.msg == "success") {
          this.listData = response.data.data.userList
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response.status == 401) {
          this.$store.dispatch('tryAutoSignIn')
        } else if (error.response.status == 500) {
          if (error.response.data.msg == "No users found for this therapist") {
            this.listData = []
          } else {
            alert(error.message)
          }
        } else {
          alert(error.message)
        }
      })
    },

    editItem(item) {
      this.editedIndex = this.listData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      let res = await this.$dialog["warning"]({
        title: this.$t('general.confirm'),
        text: this.$t('client.delete-confirm'),
        persistent: false
      })
      if (res) {
        let data = {
          cognitoId: item.cognitoId,
        }
        deleteUser(data).then((response) => {
          if (response.data.msg == "success") {
            this.getData()
          }
        }).catch(error => {
          this.handle(error)
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
              firstName: this.editedItem.firstName,
              lastName: this.editedItem.lastName,
              credits: this.editedItem.credits
            }
          }
          updateUser(data).then((response) => {
            this.sending = false
            if (response.data.msg == "success") {
              this.close()
              this.getData()
            }
          }).catch(error => {
            this.sending = false
            this.handle(error)
          })

        } else {
          dataEmail.Value = this.editedItem.email
          dataPhone.Value = this.editedItem.phoneNumber
          var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
          var attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone)
          attributeList.push(attributeEmail)
          attributeList.push(attributePhone)
          console.log('attribute list: ' + attributeList)
          userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
          console.log('sign up with: ' + this.editedItem.email + ' ' + this.editedItem.password)
          this.callback = false
          this.errcode = ''

          userPool.signUp(this.editedItem.email, this.editedItem.password, attributeList, null, (err, result) => {
            if (!this.callback) {
              this.callback = true
              console.log('register callback')
              if (err) {
                console.error('registration error: ' + JSON.stringify(err))
                this.errcode = JSON.stringify(err.code)
                this.callback = true
              } else {
                this.showerr = false
                this.errmsg = ""
                this.editedItem.cognitoId = result.userSub
                let data = {
                  cognitoId: this.editedItem.cognitoId,
                  userFirstname: this.editedItem.firstName,
                  userLastname: this.editedItem.lastName,
                  userEmail: this.editedItem.email,
                  userPhone: this.editedItem.phoneNumber
                }
                initUser(data).then((response) => {
                  this.sending = false
                  if (response.data.msg == "success") {
                    this.close()
                    this.getData()
                  }
                }).catch(error => {
                  this.sending = false
                  this.close()
                  this.handle(error)
                })
              }
            }
          })
        }
      }
    },
    reset() {
      this.searchItem = Object.assign({}, this.defaultItem)
    }
  }
}
</script>

<style scoped>
</style>