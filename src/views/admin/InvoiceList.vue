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
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending" style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-select :items="items" item-text="label" outlined
                                      item-value="id" :label="$t('appointment.list')"
                                      v-model="editedItem.id" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-file-input
                            :label="$t('invoice.file')" outlined
                            @change="uploadFile"></v-file-input>
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
import {convertToDate, getLoginInfo, singleUpload} from '@/utils'
import {deleteInvoice, getAppointmentList, getInvoiceList, uploadInvoice} from "@/api"
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
      sending: false,
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
      this.getAppointmentData()
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
        isTherapist: true
      }
      getInvoiceList(data).then((response) => {
        if (response.data.msg == "Success") {
          this.datas = response.data.data.invoices
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })

    },
    getAppointmentData(){
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        offset: 0,
        limit: 500
      }
      getAppointmentList(data).then((response) => {
        if (response.data.msg == "success") {
          let appointmens = response.data.data.appointments
          this.items = []
          for (let i = 0; i < appointmens.length; i++) {
            let tmp = {}
            tmp['id'] = appointmens[i]['id']
            tmp['label'] = appointmens[i]['firstName'] + ' ' + appointmens[i]['lastName'] + ': ' + convertToDate(appointmens[i]['startTime'])
            this.items.push(tmp)
          }
        }
      }).catch(error => {
        this.handle(error)
      })
    },

    async uploadFile(file){
      if(file != undefined){
        const result = await singleUpload(
            file,
            'invoices' // folder of the file, you should change it to your variable or a string
        )
        if (result.status === 200) {
          // Handle storing it to your database here
          this.editedItem.invoiceUrl = result.fullPath
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

    async deleteItem(item) {
      let res = await this.$dialog["warning"]({
        title: this.$t('general.confirm'),
        text: this.$t('invoice.delete-confirm'),
        persistent: false
      })
      if(res){
        let data = {
          invoiceUrl: item.invoiceUrl
        }
        deleteInvoice(data).then((response) => {
          if (response.data.msg == "OK") {
            this.$dialog.notify.success(this.$t('message.delete-success'))
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
      this.sending = true
      if (this.editedIndex > -1) {
        this.sending = false
        Object.assign(this.datas[this.editedIndex], this.editedItem)
      } else {
        if(this.editedItem.id == 0 || this.editedItem.invoiceUrl == ""){
          this.sending = false
          return
        }
        let data = {
          appointmentId: this.editedItem.id,
          invoiceUrl: this.editedItem.invoiceUrl
        }
        uploadInvoice(data).then((response) => {
          if (response.data.msg == "OK") {
            this.sending = false
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