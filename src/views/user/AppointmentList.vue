<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <BaseCard :heading="$t('appointment.appointments')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-container>
            <v-form ref="search_form">
              <v-row>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-autocomplete :items="items" item-text="username" outlined
                            item-value="cognitoId" :label="$t('appointment.user-name')"
                            v-model="searchItem.userId" class="mt-0 pt-0"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                          v-model="date"
                          :label="$t('appointment.date')"
                          prepend-icon="mdi-calendar"
                          readonly outlined
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title range>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">{{$t('general.cancel')}}</v-btn>
                      <v-btn text color="primary" @click="changeDateFilter">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-autocomplete :items="payItems" item-text="label" outlined
                            item-value="paid" :label="$t('appointment.pay-status')"
                            v-model="searchItem.decreasedCredits" class="mt-0 pt-0"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="3" class="py-0">
                  <v-btn color="success" class="mt-3 mr-3" @click="reset">{{ $t('general.reset') }}</v-btn>
                  <v-btn color="success" class="mt-3" @click="getData">{{ $t('general.search') }}</v-btn>
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
                    <v-dialog v-model="dialog" max-width="500px">
                      <template v-slot:activator="{ on }">
                        <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('appointment.create') }}</v-btn>
                      </template>
                      <v-card>
                        <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending"
                             style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px); z-index: 1"/>
                        <v-card-title>
                          <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container class="pb-0">
                            <v-row>
                              <v-col cols="12" sm="12" md="12" class="pb-0">
                                <v-autocomplete :items="items" item-text="username" outlined
                                          item-value="cognitoId" :label="$t('appointment.user-name')"
                                          v-model="editedItem.userId" class="mt-0 pt-0"></v-autocomplete>
                              </v-col>
                              <v-col cols="12" sm="12" md="12" class="pb-0">
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
                <template v-slot:item.decreasedCredits="{ item }">
                  <img class="mt-2" v-if="item.decreasedCredits == 1" src="@/assets/images/icons/check-circle.svg"/>
                </template>
                <template v-slot:item.meeting="{ item }">
                  <a v-if="item.status == 1" class="mr-2" target="_blank"
                     :href="meetingUrl + 'a=' + item.id + '&t=' + token + '&id=' + item.meetingId + '&email=' + email">
                    {{$t('appointment.join')}}</a>
                </template>
                <template v-slot:item.actions="{ item }">
<!--                  <v-btn v-if="item.status == 1" color="blue darken-1" text @click="createMeetingLink(item)" :disabled="sending">{{$t('appointment.go-meeting')}}</v-btn>-->

                  <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:no-data>
                  {{ $t('general.no-data') }}
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item key="calendar">
              <vue-cal active-view="month" class="vuecal--blue-theme" :disable-views="['years', 'year']" :locale="$i18n.locale" :time-from="8 * 60"
                       :time-to="21 * 60" :selected-date="selectedDate" :events="events"></vue-cal>
            </v-tab-item>
          </v-tabs-items>

        </div>
      </div>
    </BaseCard>
  </v-container>

</template>

<script>

import {convertEToDate, convertToDate, getCurrentDate, getLoginInfo, getToken} from '@/utils'
import {
  createAppointment,
  createMeetingId,
  deleteAppointment,
  getAppointmentList,
  getUserList, singleAppointment
} from "@/api"
import {meetingUrl} from "@/constants/config"
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  name: "AppointmentList",
  components: { VueCal },
  data: function () {
    return {
      date: null, //new Date().toISOString().substr(0, 10),
      menu: false,
      dateFilter: {
        fromDate: '',
        toDate: ''
      },
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
        {label: this.$t('appointment.paid'), paid: 1},
        {label: this.$t('appointment.no-paid'), paid: 0}
      ],
      tab: null,
      headers: [
        {
          text: this.$t('appointment.user-name'),
          align: "start",
          sortable: true,
          value: "username"
        },
        {text: this.$t('appointment.start-time'), value: "start_time"},
        {text: this.$t('appointment.end-time'), value: "end_time"},
        {
          text: this.$t('appointment.paid'),
          align: "start",
          sortable: true,
          value: "decreasedCredits"
        },
        {
          text: this.$t('appointment.meeting'),
          align: "start",
          sortable: true,
          value: "meeting"
        },
        {text: this.$t('appointment.action'), value: "actions", sortable: false}
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        userId: "",
        start_time: 0,
      },
      defaultItem: {
        userId: "",
        start_time: 0,
        decreasedCredits: null
      },
      searchItem: {
        userId: "",
        start_time: "",
        decreasedCredits: null
      },
      loginInfo: getLoginInfo(),
      timer: null,
      email: localStorage.getItem('username'),
      token: getToken().idToken,
      meetingUrl : meetingUrl
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
  mounted() {
    this.timer = setInterval(() => {
      this.getSingleData()
    }, 60 *1000)
  },

  methods: {
    changeDateFilter(){
      if(this.date != null){
        if(this.date.length == 1){
          let fromDate = new Date(this.date[0] + " 00:00:00")
          let toDate = new Date(this.date[0] + " 23:59:59")
          this.dateFilter.fromDate = fromDate.getTime()
          this.dateFilter.toDate = toDate.getTime()
        }
        else{
          let date1 = new Date(this.date[0] + " 00:00:00")
          let date2 = new Date(this.date[1] + " 23:59:59")
          let dateMil1 = date1.getTime()
          let dateMil2 = date2.getTime()
          if(dateMil1 > dateMil2){
            date1 = new Date(this.date[1] + " 00:00:00")
            date2 = new Date(this.date[0] + " 23:59:59")
            dateMil1 = date1.getTime()
            dateMil2 = date2.getTime()
            let tmp = this.date[0]
            this.date[0] = this.date[1]
            this.date[1] = tmp
            this.dateFilter.fromDate = dateMil2
            this.dateFilter.toDate = dateMil1
          }
          this.dateFilter.fromDate = dateMil1
          this.dateFilter.toDate = dateMil2
        }
      }
      console.log(this.date)
      console.log(this.dateFilter)
      this.$refs.menu.save(this.date)
    },
    initialize() {
      this.getData()
      this.getUserData()
    },
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        //this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getData() {
      this.loading = true
      let filter = {}
      if (this.searchItem.userId != "") {
        filter.userId = this.searchItem.userId
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
      let data
      if (filter != {}) {
        if(this.dateFilter.fromDate != ""){
          data = {
            cognitoId: this.loginInfo.cognitoId,
            offset: 0,
            limit: 500,
            filters: filter,
            dateFilter: this.dateFilter
          }
        }
        else{
          data = {
            cognitoId: this.loginInfo.cognitoId,
            offset: 0,
            limit: 500,
            filters: filter
          }
        }
      }
      else{
        if(this.dateFilter.fromDate != ""){
          data = {
            cognitoId: this.loginInfo.cognitoId,
            offset: 0,
            limit: 500,
            dateFilter: this.dateFilter
          }
        }
        else{
          data = {
            cognitoId: this.loginInfo.cognitoId,
            offset: 0,
            limit: 500
          }
        }
      }
      console.log(data)
      getAppointmentList(data).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          console.log(appointmens);
          this.datas = []
          this.events = []
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            let event = {}
            tmp['id'] = appointmens[i]['id']
            tmp['username'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            tmp['start_time'] = convertToDate(appointmens[i]['startTime'])
            tmp['end_time'] = convertToDate(appointmens[i]['endTime'])
            tmp['startTime'] = appointmens[i]['startTime']
            tmp['endTime'] = appointmens[i]['endTime']
            tmp['decreasedCredits'] = appointmens[i]['decreasedCredits']
            tmp['meetingLink'] = appointmens[i]['meetingLink']
            tmp['meetingId'] = ""
            tmp['JoinToken'] = ""
            if(tmp['meetingLink'] != null){
              let meetingLink = JSON.parse(tmp['meetingLink'])
              console.log(meetingLink)
              tmp['meetingId'] = meetingLink.Meeting.MeetingId
              tmp['JoinToken'] = meetingLink.Attendees[0].JoinToken
            }

            let now = new Date()
            let beforeStart = new Date(parseInt(appointmens[i]['startTime'], 10) - 300000)
            let endTime = new Date(parseInt(appointmens[i]['endTime'], 10))
            if(now>endTime){
              tmp['status'] = 2
            }
            else if(now > beforeStart && tmp['meetingLink'] != null) {
              tmp['status'] = 1
            }
            else {
              tmp['status'] = 0
            }

            event['start'] = convertEToDate(appointmens[i]['startTime'])
            event['end'] = convertEToDate(appointmens[i]['endTime'])
            event['title'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            this.datas.push(tmp)
            this.events.push(event)
          }
          console.log(this.datas)
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
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
        console.log(response)
      }).catch(error => {
        this.handle(error)
      })
    },
    getSingleData(){
      for (let i = 0; i < this.datas.length; i++) {
        if(this.datas[i]['status'] != 2 && this.datas[i]['meetingLink'] == null){
          let now = new Date()
          let beforeStart = new Date(parseInt(this.datas[i]['startTime'], 10) - 300000)
          if(now > beforeStart) {
            let data = {
              appointmentId: this.datas[i]['id']
            }
            createMeetingId(data).then((response) => {
              console.log(response)
              this.datas[i]['status'] = 1
              // if (response.data.msg == "success") {
              //
              // }
            })
            singleAppointment(this.datas[i]['id']).then((response) => {
              console.log(response)
              if(response.data.msg == "success"){
                this.datas[i]['meetingLink'] = response.data.data.appointment.meetingLink
                if(this.datas[i]['meetingLink'] != null){
                  let meetingLink = JSON.parse(this.datas[i]['meetingLink'])
                  this.datas[i]['meetingId'] = meetingLink.Meeting.MeetingId
                  this.datas[i]['status'] = 1
                }
              }
            })
          }
          else if(now < beforeStart) {
            this.datas[i]['status'] = 0
          }
        }
      }
    },
    async deleteItem(item) {
      let res = await this.$dialog["warning"]({
        title: this.$t('general.confirm'),
        text: this.$t('appointment.delete-confirm'),
        persistent: false
      })
      if (res) {
        deleteAppointment(item.id).then((response) => {
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
        if (this.editedItem.userId == "" || this.editedItem.start_time == 0) {
          this.sending = false
          return
        }
        let data = {
          cognitoId: this.loginInfo.cognitoId,
          userId: this.editedItem.userId,
          datetime: Date.parse(this.editedItem.start_time)
        }
        createAppointment(data).then((response) => {
          this.sending = false
          if (response.data.msg == "success") {
            this.close()
            this.getData()
          }
          else{
            this.$dialog.notify.error(response.data.msg)
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
      this.getData()
    }
  }
}
</script>

<style>
.mdi-exclamation{
  display: none !important;
}

</style>