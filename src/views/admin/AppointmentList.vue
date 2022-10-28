<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('appointment.appointments')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-container>
            <v-form ref="search_form">
              <v-row>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-select :items="therapistItems" item-text="name" outlined
                            item-value="cognitoId" :label="$t('appointment.therapist-name')"
                            v-model="searchItem.therapistId" class="mt-0 pt-0"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-select :items="items" item-text="username" outlined
                            item-value="cognitoId" :label="$t('appointment.user-name')"
                            v-model="searchItem.userId" class="mt-0 pt-0"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-text-field
                      v-model="searchItem.start_time"
                      type="date"
                      hide-details outlined
                      background-color="transparent"
                      :label="$t('appointment.date')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-select :items="payItems" item-text="label" outlined
                            item-value="paid" :label="$t('appointment.pay-status')"
                            v-model="searchItem.decreasedCredits" class="mt-0 pt-0"></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0 mb-3">
                  <v-btn color="success" class="mt-0 mr-3" @click="reset">{{ $t('general.reset') }}</v-btn>
                  <v-btn color="success" class="mt-0" @click="getData">{{ $t('general.search') }}</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-tabs background-color="success" color="white" grow v-model="tab">
            <v-tab key="table"> {{$t('appointment.table-view')}} </v-tab>
            <v-tab key="calendar"> {{$t('appointment.calendar-view')}} </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item key="table">
              <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading"
                            loading-text="Loading...">
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>{{ $t('appointment.my') }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px" persistent>
                      <template v-slot:activator="{ on }">
                        <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('appointment.create') }}</v-btn>
                      </template>
                      <v-card>
                        <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending" style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);"/>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-select :items="therapistItems" item-text="name" outlined
                                          item-value="cognitoId" :label="$t('appointment.therapist-name')"
                                          v-model="editedItem.therapistId" class="mt-0 pt-0"></v-select>
                              </v-col>
                              <v-col cols="12" sm="12" md="12">
                                <v-select :items="items" item-text="username" outlined
                                          item-value="cognitoId" :label="$t('appointment.user-name')"
                                          v-model="editedItem.userId" class="mt-0 pt-0"></v-select>
                              </v-col>
                              <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    v-model="editedItem.start_time"
                                    type="datetime-local"
                                    hide-details outlined
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
            </v-tab-item>
            <v-tab-item key="calendar">
              <vue-cal active-view="month" class="vuecal--blue-theme"
                       :selected-date="selectedDate" :events="events"></vue-cal>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </BaseCard>
  </v-container>
</template>

<script>
import axios from "axios"
import {apiBaseUrl} from "@/constants/config"
import {getLoginInfo, convertToDate, convertEToDate, getCurrentDate} from '@/utils'
import {createAppointment, getAppointmentList, getTherapistList, getUserList} from "@/api"
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: "AppointmentList",
  components: { VueCal },
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
      selectedDate: getCurrentDate(),
      events: [],
      dialog: false,
      loading: false,
      sending: false,
      items: [],
      payItems: [
        {label: this.$t('appointment.paid'), paid: true},
        {label: this.$t('appointment.no-paid'), paid: false}
      ],
      tab: null,
      therapistItems: [],
      headers: [
        {
          text: this.$t('appointment.therapist-name'),
          align: "start",
          sortable: true,
          value: "therapistname"
        },
        {
          text: this.$t('appointment.user-name'),
          align: "start",
          sortable: true,
          value: "username"
        },
        {text: this.$t('appointment.start-time'), value: "start_time"},
        {text: this.$t('appointment.end-time'), value: "end_time"},
        {text: this.$t('appointment.action'), value: "actions", sortable: false}
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        therapistId: "",
        userId: "",
        start_time: 0,
      },
      defaultItem: {
        start_time: 0,
        therapistId: "",
        userId: "",
        decreasedCredits: null
      },
      searchItem: {
        userId: "",
        start_time: "",
        therapistId: "",
        decreasedCredits: null
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
        this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getData() {
      this.loading = true
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        offset: 0,
        limit: 500
      }
      let filter = {}
      if (this.searchItem.therapistId != "") {
        filter.therapistId = this.searchItem.therapistId
      }
      if (this.searchItem.userId != "") {
        filter.userId = this.searchItem.userId
      }
      if (this.searchItem.start_time != "") {
        filter.start_time = this.searchItem.start_time
      }
      if (this.searchItem.decreasedCredits != null) {
        filter.decreasedCredits = this.searchItem.decreasedCredits
      }
      if (filter != {}) {
        data = {
          cognitoId: this.loginInfo.cognitoId,
          offset: 0,
          limit: 500,
          filters: filter
        }
      }

      getAppointmentList(data).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          this.datas = []
          this.events = []
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            let event = {}
            tmp['id'] = appointmens[i]['id']
            tmp['therapistname'] = appointmens[i]['name']
            tmp['username'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            tmp['start_time'] = convertToDate(appointmens[i]['startTime'])
            tmp['end_time'] = convertToDate(appointmens[i]['endTime'])
            event['start'] = convertEToDate(appointmens[i]['startTime'])
            event['end'] = convertEToDate(appointmens[i]['endTime'])
            event['title'] = appointmens[i]['name'] + ': ' + appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            this.datas.push(tmp)
            this.events.push(event)
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
        if (this.editedItem.therapistId == "" || this.editedItem.userId == "" || this.editedItem.start_time == 0) {
          this.sending = false
          return
        }
        let data = {
          cognitoId: this.editedItem.therapistId,
          userId: this.editedItem.userId,
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
    },
    reset() {
      this.searchItem = Object.assign({}, this.defaultItem)
    }
  }
}
</script>
<style scoped>
</style>