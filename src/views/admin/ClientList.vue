<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard heading="Clients">
      <div>
        <v-list-item-subtitle class="text-wrap">

        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="listData" sort-by="calories" class="border">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>My Clients</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="1000px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Create Client</v-btn>
                  </template>
                  <v-card>
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
                            <v-col cols="12" sm="12" md="6" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.firstname"
                                  :rules="firstRules"
                                  required outlined
                                  label="User Firstname"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.lastname"
                                  :rules="lastRules"
                                  required outlined
                                  label="User Lastname"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="12" md="6" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.user_email"
                                  :rules="emailRules"
                                  required outlined
                                  label="User Email"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6" class="pb-0">
                              <v-text-field
                                  v-model="editedItem.user_phone"
                                  :rules="phoneRules"
                                  required outlined
                                  label="User Phone"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>

                      </v-container>
                    </v-card-text>

                    <v-card-actions class="px-10 pb-3">
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
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
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </BaseCard>
  </v-container>
</template>

<script>
import {getUserList} from "@/api/appointment_master";
import {saveClient} from "@/api/client_master";
import {getLoginInfo} from '@/utils'

export default {
  name: "ClientList",
  data: () => ({
    showerr: false,
    errcode: '',
    errmsg: '',
    page: {
      title: "ClientList",
    },
    breadcrumbs: [
      {
        text: "ClientList",
        disabled: false,
        to: "#",
      }
    ],
    dialog: false,
    headers: [
      {
        text: "User FirstName",
        align: "start",
        sortable: false,
        value: "firstname"
      },
      {
        text: "User LastName",
        align: "start",
        sortable: false,
        value: "lastname"
      },
      {
        text: "User Email",
        align: "start",
        sortable: false,
        value: "user_email"
      },
      {
        text: "User Phone",
        align: "start",
        sortable: false,
        value: "user_phone"
      },
      { text: "Created Time", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    listData: [],
    editedIndex: -1,
    editedItem: {
      firstname: "",
      lastname: "",
      user_email: "",
      user_phone: "",
      created_at: 0
    },
    defaultItem: {
      firstname: "",
      lastname: "",
      user_email: "",
      user_phone: "",
      created_at: 0
    },
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    phoneRules:[
      v => !!v || "Phone Number is required",
    ],
    firstRules:[
      v => !!v || "User First Name is required",
    ],
    lastRules:[
      v => !!v || "User Last Name is required",
    ],
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
      this.listData = [
        {
          id: 1,
          firstname: "Frozen Yogurt",
          lastname: "last",
          user_email: "t1@t.com",
          user_phone: "12345789",
          created_at: "2022/10/10 10:10",
        }
      ];
      //this.getData()
      //this.getUserData()
    },
    getData(){
      let loginInfo = getLoginInfo();
      console.log(loginInfo)
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
    },

    editItem(item) {
      this.editedIndex = this.listData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      if(confirm("Are you sure you want to delete this appointment?")){
        console.log(item)
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
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        if (this.editedIndex > -1) {
          Object.assign(this.listData[this.editedIndex], this.editedItem);
        } else {
          let loginInfo = getLoginInfo();
          let data = {
            cognitoId: loginInfo.cognitoId,
            userFirstname: this.editedIndex.firstname,
            userLastname: this.editedIndex.lastname,
            userEmail: this.editedIndex.user_email,
            userPhone: this.editedIndex.user_phone
          }
          saveClient(data).then(res => {
            if(res.data.message == "success"){
              console.log(res.data.data)
            }
          }).catch(error => {
            alert(error)
          });
        }
        this.close();
      }
    }
  }
}
</script>

<style scoped>

</style>