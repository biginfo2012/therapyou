<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <BaseCard :heading="$t('appointment.appointments')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" :footer-props="{'items-per-page-text':$t('general.per')}"
                        loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ $t('appointment.my') }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
<!--            <template v-slot:item.decreasedCredits="{ item }">-->
<!--              <v-icon v-if="item.decreasedCredits == 1" small>mdi-check</v-icon>-->
<!--            </template>-->
            <template v-slot:item.meeting="{ item }">
              <v-btn v-if="item.status == 1" class="mr-2" :disabled="credits <= 0" @click="decreaseCredits(item.meetingId, item.id)">
                {{$t('appointment.join')}}</v-btn>
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

import {convertToDate, dateFormatFit, getLoginInfo, getToken} from '@/utils'
import {decreaseCredits, getAppointmentList, getTherapist, singleAppointment} from "@/api"
import {meetingUrl} from "@/constants/config"
export default {
  name: "AppointmentList",
  data: function () {
    return {
      dateShow: null,
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
      loading: false,
      payItems: [
        {label: this.$t('appointment.paid'), paid: 1},
        {label: this.$t('appointment.no-paid'), paid: 0}
      ],
      headers: [
        {
          text: this.$t('appointment.therapist-name'),
          align: "start",
          sortable: true,
          value: "therapistname"
        },
        {text: this.$t('appointment.start-time'), value: "start_time"},
        {text: this.$t('appointment.end-time'), value: "end_time"},
        // {
        //   text: this.$t('appointment.paid'),
        //   align: "center",
        //   sortable: true,
        //   value: "decreasedCredits"
        // },
        {
          text: this.$t('appointment.meeting'),
          align: "start",
          sortable: true,
          value: "meeting"
        },
      ],
      datas: [],
      editedIndex: -1,
      credits: getLoginInfo().credits,
      defaultItem: {
        start_time: null,
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
    date(val){
      if(val != null){
        if(val.length == 1){
          this.dateShow = dateFormatFit(val[0])
        }
        else{
          let date1 = new Date(val[0] + " 00:00:00")
          let date2 = new Date(val[1] + " 23:59:59")
          let dateMil1 = date1.getTime()
          let dateMil2 = date2.getTime()
          if(dateMil1 > dateMil2){
            this.dateShow = dateFormatFit(val[1]) + " ~ " + dateFormatFit(val[0])
          }
          else{
            this.dateShow = dateFormatFit(val[0]) + " ~ " + dateFormatFit(val[1])
          }
        }
      }

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
      console.log(this.dateFilter)
      this.$refs.menu.save(this.date)
    },
    initialize() {
      this.getData()
    },
    handle(error, isConfirm = false) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        if(isConfirm) this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getData() {
      this.loading = true
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        offset: 0,
        limit: 500,
      }
      this.datas = []
      getAppointmentList(data).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            tmp['id'] = appointmens[i]['id']
            tmp['therapistname'] = appointmens[i]['therapist']['fullname']
            tmp['start_time'] = convertToDate(appointmens[i]['details']['startTime'])
            tmp['end_time'] = convertToDate(appointmens[i]['details']['endTime'])
            tmp['startTime'] = appointmens[i]['details']['startTime']
            tmp['endTime'] = appointmens[i]['details']['endTime']
            tmp['decreasedCredits'] = appointmens[i]['details']['decreasedCredits']
            tmp['meetingLink'] = appointmens[i]['details']['meetingLink']
            tmp['meetingId'] = ""
            tmp['JoinToken'] = ""
            if(tmp['meetingLink'] != null){
              let meetingLink = JSON.parse(tmp['meetingLink'])
              tmp['meetingId'] = meetingLink.Meeting.MeetingId
              tmp['JoinToken'] = meetingLink.Attendees[0].JoinToken
            }

            let now = new Date()
            let beforeStart = new Date(parseInt(appointmens[i]['details']['startTime'], 10) - 300000)
            let endTime = new Date(parseInt(appointmens[i]['details']['endTime'], 10))
            if(now>endTime){
              tmp['status'] = 2
            }
            else if(now > beforeStart && tmp['meetingLink'] != null) {
              tmp['status'] = 1
            }
            else {
              tmp['status'] = 0
            }
            this.datas.push(tmp)
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })
    },
    getSingleData(){
      for (let i = 0; i < this.datas.length; i++) {
        if(this.datas[i]['status'] != 2 && this.datas[i]['meetingLink'] == null){
          let now = new Date()
          let beforeStart = new Date(parseInt(this.datas[i]['startTime'], 10) - 300000)
          if(now > beforeStart) {
            singleAppointment(this.datas[i]['id']).then((response) => {
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
      getTherapist(this.loginInfo.cognitoId).then((response) => {
        if(!response.data.error){
          let userData = response.data.data.user[0]
          this.credits = userData.credits
        }
      }).catch(error => {
        this.handle(error)
      })
    },
    decreaseCredits(meetingId, id){
      let url = this.meetingUrl + 'a=' + id + '&t=' + this.token + '&id=' + meetingId + '&email=' + this.email
      window.open(url, '_blank', 'noreferrer');
    },
    decreaseUser(meetingId){
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        creditsToBeDecreased: 1,
        firstMeeting: false,
        meetingId: meetingId
      }
      decreaseCredits(data).then((response) => {
        if (!response.data.error) {
          return true
        }
        else{
          this.$dialog.notify.error(response.data.msg)
          return false
        }
      }).catch(error => {
        this.handle(error, true)
        return false
      })
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