<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('appointment.appointments')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading"
                        loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>{{ $t('appointment.my') }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px" persistent>
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('appointment.create') }}</v-btn>
                  </template>
                  <v-card>
                    <img src="@/assets/images/logo-icon.gif" width="80" v-show="sending" style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-select :items="therapistItems" item-text="name"
                                      item-value="cognitoId" :label="$t('appointment.therapist-name')"
                                      v-model="editedItem.therapistCognitoId" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-select :items="items" item-text="username"
                                      item-value="cognitoId" :label="$t('appointment.user-name')"
                                      v-model="editedItem.cognitoId" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                v-model="editedItem.start_time"
                                type="datetime-local"
                                hide-details
                                filled
                                background-color="transparent"
                                :label="$t('appointment.start-time')"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close" :disabled="sending">{{ $t('general.cancel') }}</v-btn>
                      <v-btn color="blue darken-1" text @click="save" :disabled="sending">{{ $t('general.save') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
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
import axios from "axios"
import {apiBaseUrl} from "@/constants/config"
import {getLoginInfo, convertToDate} from '@/utils'
import {createAppointment, getAppointmentList, getTherapistList, getUserList} from "@/api"

export default {
  name: "AppointmentList",
  data: function () {
    return {
      page: {
        title: this.$t('appointment.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('appointment.list'),
          disabled: false,
          to: "#",
        }
      ],
      dialog: false,
      loading: false,
      sending: false,
      items: [],
      therapistItems: [],
      headers: [
        {
          text: this.$t('appointment.therapist-name'),
          align: "start",
          sortable: false,
          value: "therapistname"
        },
        {
          text: this.$t('appointment.user-name'),
          align: "start",
          sortable: false,
          value: "username"
        },
        {text: this.$t('appointment.start-time'), value: "start_time"},
        {text: this.$t('appointment.end-time'), value: "end_time"},
        {text: this.$t('appointment.action'), value: "actions", sortable: false}
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        therapistCognitoId: "",
        cognitoId: "",
        start_time: 0,
      },
      defaultItem: {
        therapistCognitoId: "",
        cognitoId: "",
        start_time: 0,
      },
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
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.getData()
      this.getUserData()
      this.getTherapistData()
    },
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        this.$dialog.notify.error(error.response.data.message)
      }
    },
    getData() {
      this.loading = true
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        offset: 0,
        limit: 500
      }
      getAppointmentList(data).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          this.datas = []
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            tmp['id'] = appointmens[i]['id']
            tmp['therapistname'] = appointmens[i]['name']
            tmp['username'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            tmp['start_time'] = convertToDate(appointmens[i]['startTime'])
            tmp['end_time'] = convertToDate(appointmens[i]['endTime'])
            this.datas.push(tmp)
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })

    },
    getTherapistData() {
      let data = {
        cognitoId: this.loginInfo.cognitoId,
      }
      getTherapistList(data).then((response) => {
        if (response.data.msg == "success") {
          let therapists = response.data.data.therapistList
          this.therapistItems = []
          for (let i = 0; i < therapists.length; i++) {
            let tmp = {}
            tmp['name'] = therapists[i]['name']
            tmp['cognitoId'] = therapists[i]['cognitoId']
            this.therapistItems.push(tmp)
          }
        }
      }).catch(error => {
        this.handle(error)
      })
    },
    getUserData() {
      let data = {
        cognitoId: this.loginInfo.cognitoId,
      }
      getUserList(data).then((response) => {
        if (response.data.msg == "success") {
          let users = response.data.data.userList
          this.items = []
          for (let i = 0; i < users.length; i++) {
            let tmp = {}
            tmp['username'] = users[i]['firstName'] + ' ' + users[i]['lastName']
            tmp['cognitoId'] = users[i]['cognitoId']
            this.items.push(tmp)
          }
        }
      }).catch(error => {
        this.handle(error)
      })
    },
    async deleteItem(item) {
      let res = await this.$dialog["warning"]({
        title: this.$t('general.confirm'),
        text: this.$t('appointment.delete-confirm'),
        persistent: false
      })
      if(res){
        axios.get(apiBaseUrl + 'appointments/delete/' + item.id).then((response) => {
          if (response.data.msg == "success") {
            this.$dialog.notify.success(this.$t('message.delete-success'))
            this.getData()
          }
        }).catch(error => {
          console.log(error)
          this.$dialog.notify.error(error.response.data.message)
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
      this.sending = true
      if (this.editedIndex > -1) {
        Object.assign(this.datas[this.editedIndex], this.editedItem)
        this.sending = false
      } else {
        if (this.editedItem.therapistCognitoId == "" || this.editedItem.cognitoId == "" || this.editedItem.start_time == 0) {
          this.sending = false
          return
        }
        let data = {
          cognitoId: this.editedItem.therapistCognitoId,
          userId: this.editedItem.cognitoId,
          datetime: Date.parse(this.editedItem.start_time)
        }
        createAppointment(data).then((response) => {
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
  }
}
</script>
<style scoped>
</style>