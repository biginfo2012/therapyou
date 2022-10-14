<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard heading="Appointments">
      <div>
        <v-list-item-subtitle class="text-wrap">

        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="border">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>My Appointments</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Create Appointment</v-btn>
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
                                      item-value="cognitoId" label="User Name"
                                      v-model="editedItem.username" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                v-model="editedItem.start_time"
                                type="datetime-local"
                                hide-details
                                filled
                                background-color="transparent"
                                label="Start Time"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <!--              <v-icon small class="mr-2" @click="cancelItem(item)">mdi-pencil</v-icon>-->
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
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
import {getAppointmentList, getUserList} from "@/api/appointment_master";
import {getLoginInfo} from '@/utils'

export default {
  name: "TherapistList",
  data: () => ({
    page: {
      title: "TherapistList",
    },
    breadcrumbs: [
      {
        text: "TherapistList",
        disabled: false,
        to: "#",
      }
    ],
    dialog: false,
    items: [
      {username: 'ghost', cognitoId: '8cd644a8-0a60-46fe-a507-13b64a0fc25f'},
      {username: 'big', cognitoId: '8cd644a8-0a60-46fe-a507-13b64a0fc25e'},
    ],
    headers: [
      {
        text: "User Name",
        align: "start",
        sortable: false,
        value: "username"
      },
      { text: "Start Time", value: "start_time" },
      { text: "Created Time", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      username: "",
      start_time: 0,
      created_at: 0
    },
    defaultItem: {
      username: "",
      start_time: 0,
      created_at: 0
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New" : "Edit";
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
      this.desserts = [
        {
          id: 1,
          username: "Frozen Yogurt",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 2,
          username: "Ice cream sandwich",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 3,
          username: "Eclair",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 4,
          username: "Cupcake",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 5,
          username: "Gingerbread",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 6,
          username: "Jelly bean",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 7,
          username: "Lollipop",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 8,
          username: "Honeycomb",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 9,
          username: "Donut",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        },
        {
          id: 10,
          username: "KitKat",
          start_time: "2022/10/20 10:10",
          created_at: "2022/10/10 10:10",
        }
      ];
      this.getData()
      this.getUserData()
    },
    getData(){
      let loginInfo = getLoginInfo();
      let data = {
        cognitoId: loginInfo.cognitoId,
        offset: 0,
        limit: 500
      }
      getAppointmentList(data).then(res => {
        if(res.data.message == "success"){
          console.log(res.data.data.appointments)
        }
      }).catch(error => {
        alert(error)
      });
      // axios.post(apiBaseUrl + 'appointments/list', {
      //   cognitoId: loginInfo.cognitoId,
      //   offset: 0,
      //   limit: 500
      // }).then((response) => {
      //   if(response.data.message == "success"){
      //     console.log(response.data.data.appointments)
      //   }
      // }).catch(error => {
      //   alert(error)
      // });
    },
    getUserData(){
      let loginInfo = getLoginInfo();
      let data = {
        cognitoId: loginInfo.cognitoId,
      }
      getUserList(data).then(res => {
        if(res.data.message == "success"){
          console.log(res.data.data)
        }
      }).catch(error => {
        alert(error)
      });
      // axios.post(apiBaseUrl + 'appointments/list', {
      //   cognitoId: loginInfo.cognitoId,
      //   offset: 0,
      //   limit: 500
      // }).then((response) => {
      //   if(response.data.message == "success"){
      //     console.log(response.data.data.appointments)
      //   }
      // }).catch(error => {
      //   alert(error)
      // });
    },

    cancelItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      if(confirm("Are you sure you want to delete this appointment?")){
        axios.get(apiBaseUrl + 'appointments/delete/' + item.id).then((response) => {
          if(response.data.message == "success"){
            const index = this.desserts.indexOf(item);
            this.desserts.splice(index, 1);
            this.getData();
          }
        }).catch(error => {
          alert(error)
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
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        //this.desserts.push(this.editedItem);
        if(this.editedItem.username == "" || this.editedItem.start_time == 0){
          return
        }
        let loginInfo = getLoginInfo();
        console.log(Date.parse(this.editedItem.start_time));
        axios.post(apiBaseUrl + 'appointments/create', {
          cognitoId: loginInfo.cognitoId,
          userId: this.editedItem.username,
          datetime: Date.parse(this.editedItem.start_time)
        }).then((response) => {
          console.log(response)
          if(response.data.message == "success"){
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