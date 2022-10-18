<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('appointment.appointments')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>{{ $t('appointment.my') }}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('appointment.create') }}</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
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
                      <v-btn color="blue darken-1" text @click="close">{{ $t('general.cancel') }}</v-btn>
                      <v-btn color="blue darken-1" text @click="save">{{ $t('general.save') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="success" @click="initialize">{{ $t('general.reset') }}</v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </BaseCard>
  </v-container>

</template>

<script>
import axios from "axios";
import {apiBaseUrl} from "@/constants/config";
import {getLoginInfo, getToken, convertToDate} from '@/utils'

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
      items: [],
      headers: [
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
        cognitoId: "",
        start_time: 0,
      },
      defaultItem: {
        cognitoId: "",
        start_time: 0,
      }
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? this.$t('general.new') : this.$t('general.edit');
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getData()
      this.getUserData()
    },
    getData() {
      this.loading = true;
      let loginInfo = getLoginInfo();
      let data = {
        cognitoId: loginInfo.cognitoId,
        offset: 0,
        limit: 500
      }
      let config = {
        headers: {
          'Accept': 'application/json',
          'Authorization': getToken().accessToken,
          'Content-Type': 'application/json'
        }
      }
      axios.post(apiBaseUrl + 'appointments/list', data, config).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          this.datas = [];
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            tmp['id'] = appointmens[i]['id'];
            tmp['username'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName']
            tmp['start_time'] = convertToDate(appointmens[i]['startTime'])
            tmp['end_time'] = convertToDate(appointmens[i]['endTime'])
            this.datas.push(tmp)
          }
        }
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        alert(error);
      });

    },
    getUserData() {
      let loginInfo = getLoginInfo();
      let data = {
        cognitoId: loginInfo.cognitoId,
      }
      let config = {
        headers: {
          'Accept': 'application/json',
          'Authorization': getToken().idToken,
          'Content-Type': 'application/json'
        }
      }
      axios.post(apiBaseUrl + 'user/list', data, config).then((response) => {
        if (response.data.msg == "success") {
          let users = response.data.data.userList
          this.items = [];
          for (let i = 0; i < users.length; i++) {
            let tmp = {}
            tmp['username'] = users[i]['firstName'] + ' ' + users[i]['lastName']
            tmp['cognitoId'] = users[i]['cognitoId']
            this.items.push(tmp)
          }
        }
      }).catch(error => {
        console.log(error);
        if(error.message == "Internal server error"){
          console.log('d')
        }
      });
    },

    deleteItem(item) {
      if (confirm(this.$t('appointment.delete-confirm'))) {
        axios.get(apiBaseUrl + 'appointments/delete/' + item.id).then((response) => {
          if (response.data.msg == "success") {
            this.getData();
          }
        }).catch(error => {
          console.log(error);
          if(error.response.data.message == "The incoming token has expired"){
            console.log('refresh_token')
          }
          else{
            alert(error.response.data.message)
          }
        });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.datas[this.editedIndex], this.editedItem);
      } else {
        //this.datas.push(this.editedItem);
        if (this.editedItem.cognitoId == "" || this.editedItem.start_time == 0) {
          return
        }
        let loginInfo = getLoginInfo();
        let data = {
          cognitoId: loginInfo.cognitoId,
          userId: this.editedItem.cognitoId,
          datetime: Date.parse(this.editedItem.start_time)
        }
        let config = {
          headers: {
            'Accept': 'application/json',
            'Authorization': getToken().idToken,
            'Content-Type': 'application/json'
          }
        }
        axios.post(apiBaseUrl + 'appointments/create', data, config).then((response) => {
          if (response.data.msg == "success") {
            this.getData();
          }
        }).catch(error => {
          alert(error)
        });
      }
      this.close();
    }
  }
}
</script>

<style scoped>

</style>