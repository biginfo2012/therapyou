<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('invoice.invoices')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>{{ $t('invoice.my')}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('invoice.create') }}</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-select :items="items" item-text="label"
                                      item-value="id" :label="$t('appointment.list')"
                                      v-model="editedItem.id" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-file-input
                            :label="$t('invoice.file')"
                            @change="uploadFile"></v-file-input>
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
import {convertToDate, getLoginInfo, getToken, singleUpload} from '@/utils'
export default {
  name: "InvoiceList",
  data: function () {
    return {
      page: {
        title: this.$t('invoice.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('invoice.list'),
          disabled: false,
          to: "#",
        }
      ],
      dialog: false,
      loading: false,
      items: [
      ],
      headers: [
        {
          text: this.$t('invoice.url'),
          align: "start",
          sortable: false,
          value: "invoiceUrl"
        },
        { text: this.$t('appointment.action'), value: "actions", sortable: false }
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        invoiceUrl: ""
      },
      defaultItem: {
        id: 0,
        invoiceUrl: ""
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
      this.getAppointmentData()
    },
    getData() {
      this.loading = true;
      let loginInfo = getLoginInfo();
      let data = {
        cognitoId: loginInfo.cognitoId,
        isTherapist: true
      }
      let config = {
        headers: {
          'Accept': 'application/json',
          'Authorization': getToken().idToken,
          'Content-Type': 'application/json'
        }
      }
      axios.post(apiBaseUrl + 'invoice/list', data, config).then((response) => {
        if (response.data.msg == "Success") {
          this.datas = response.data.data.invoices;
        }
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        alert(error);
      });

    },
    getAppointmentData(){
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
          this.items = [];
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            tmp['id'] = appointmens[i]['id'];
            tmp['label'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName'] + ': ' + convertToDate(appointmens[i]['startTime'])
            this.items.push(tmp)
          }
        }
      }).catch(error => {
        alert(error);
      });
    },

    async uploadFile(file){
      if(file != undefined){
        const result = await singleUpload(
            file,
            'invoices' // folder of the file, you should change it to your variable or a string
        )
        if (result.status === 200) {
          // Handle storing it to your database here
          this.editedItem.invoiceUrl = result.fullPath;
          console.log(result)
        } else {
          alert("File Upload to S3 failed")
        }
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            // Let FilePond know the request has been cancelled
            alert("File Upload to S3 aborted")
          },
        }
      }

    },

    deleteItem(item) {
      if(confirm(this.$t('invoice.delete-confirm'))){
        let data = {
          invoiceUrl: item.invoiceUrl
        }
        let config = {
          headers: {
            'Accept': 'application/json',
            'Authorization': getToken().accessToken,
            'Content-Type': 'application/json'
          }
        }
        axios.post(apiBaseUrl + 'invoice/delete', data, config).then((response) => {
          if (response.data.msg == "OK") {
            this.getData();
          }
        }).catch(error => {
          alert(error);
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
        if(this.editedItem.id == 0 || this.editedItem.invoiceUrl == ""){
          return
        }
        let data = {
          appointmentId: this.editedItem.id,
          invoiceUrl: this.editedItem.invoiceUrl
        }
        let config = {
          headers: {
            'Accept': 'application/json',
            'Authorization': getToken().idToken,
            'Content-Type': 'application/json'
          }
        }
        axios.post(apiBaseUrl + 'invoice/upload', data, config).then((response) => {
          if (response.data.msg == "OK") {
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