<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <BaseCard :heading="$t('invoice.invoices')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ $t('invoice.therapist')}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" persistent max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="success" dark class="mb-2" v-on="on">{{ $t('invoice.create') }}</v-btn>
                  </template>
                  <v-card>
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending" style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px); z-index: 1"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                      <v-container class="pb-0">
                        <v-form ref="uploadForm">
                          <v-row>
                            <v-col cols="12" sm="12" md="12" class="pb-0">
                              <v-autocomplete :items="items" item-text="label" outlined required :rules="fieldRules"
                                              item-value="id" :label="$t('appointment.list')"
                                              v-model="editedItem.id" class="mt-0 pt-0"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="pb-0">
                              <v-file-input
                                  :label="$t('invoice.file')" outlined
                                  @change="uploadFile"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                  v-model="editedItem.invoiceCode"
                                  :rules="numberRules" max-length="10"
                                  hide-details outlined required
                                  background-color="transparent"
                                  :label="$t('invoice.number')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field
                                  v-model="editedItem.invoiceDate"
                                  type="date" :rules="fieldRules"
                                  hide-details outlined required
                                  background-color="transparent"
                                  :label="$t('invoice.date')"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" class="pb-0">
                              <v-select
                                  v-model="editedItem.therapyType"
                                  :items="areas"
                                  :label="$t('invoice.therapist-type')"
                                  outlined
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-form>

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
              <v-icon small class="mr-2" @click="downloadFile(item)">mdi-cloud-download</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
import {convertToDate, getLoginInfo, singleUpload} from '@/utils'
import {deleteInvoice, getAppointmentList, getInvoiceList, uploadInvoice} from "@/api"
import axios from "axios";
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
      areas: ["Stress", "Ansia", "Attacchi di panico", "Crisi esistenziale", "Depressione post partum", "Dipendenza sessuale", "Disturbi alimentari", "Disturbi di personalita",
        "Disturbo bipolare", "Disturbo post traumatico da stress", "Lutto", "Burn out", "Fobie", "Impotenza", "Insonnia", "Ipocondria", "Problemi adolescenziali",
        "Problemi relazionali", "Somatizzazione", "Tricotillomania", "Tic", "Stalking", "Problemi di coppia", "Nevrosi", "Paranoia", "Mobbing", "Ludopatia", "Frigidita",
        "Esaurimento nervoso", "Divorzio o separazione", "Disturbo ossessivo compulsivo", "Disturbo da alimentazione incontrollata", "Dipendenze comportamentali",
        "Dipendenza affettiva", "Depressione", "Bulimia", "Anoressia", "Aggressivita", "Balbuzie", "Anorgasmia"],
      dialog: false,
      loading: false,
      sending: false,
      items: [
      ],
      headers: [
        {
          text: this.$t('invoice.number'),
          align: "start",
          sortable: true,
          value: "invoiceCode"
        },
        {
          text: this.$t('invoice.date'),
          align: "start",
          sortable: true,
          value: "invoiceDate"
        },
        {
          text: this.$t('invoice.therapist-name'),
          align: "start",
          sortable: true,
          value: "therapyType"
        },
        { text: this.$t('appointment.action'), value: "actions", sortable: false }
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        invoiceUrl: "",
        invoiceCode: "",
        invoiceDate: "",
        therapyType: ""
      },
      defaultItem: {
        id: 0,
        invoiceUrl: "",
        invoiceCode: "",
        invoiceDate: "",
        therapyType: ""
      },
      loginInfo: getLoginInfo(),
      fieldRules:[
        v => !!v || this.$t('error-messages.field-required'),
      ],
      numberRules: [
        v => !!v || this.$t('error-messages.field-required'),
        v => (v && v.length <= 10) || this.$t('error-messages.password-length')
      ],
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
    downloadFile(item) {
      console.log(item.invoiceUrl)
      axios({
        url: item.invoiceUrl, // File URL Goes Here
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        console.log(res)
        var FILE = window.URL.createObjectURL(new Blob([res.data]))

        var docUrl = document.createElement('a')
        docUrl.href = FILE
        let fileName = item.invoiceUrl.split("/").pop()
        docUrl.setAttribute('download', fileName)
        document.body.appendChild(docUrl)
        docUrl.click()
      });
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
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        isTherapist: true
      }
      getInvoiceList(data).then((response) => {
        if (response.data.msg == "Success") {
          this.datas = response.data.data.invoices
          for (let i = 0; i < this.datas.length; i++){
            this.datas[i]['invoiceDate'] = this.datas[i]['invoiceDate'].substring(0, 10)
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })

    },
    getAppointmentData(){
      let filter = {}
      filter.decreasedCredits = 1
      let data = {
        cognitoId: this.loginInfo.cognitoId,
        offset: 0,
        limit: 500,
        filters: filter
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
      this.$refs.uploadForm.validate()
      if (this.$refs.uploadForm.validate(true)) {
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
            invoiceUrl: this.editedItem.invoiceUrl,
            invoiceCode: this.editedItem.invoiceCode,
            invoiceDate: this.editedItem.invoiceDate,
            therapyType: this.editedItem.therapyType
          }
          uploadInvoice(data).then((response) => {
            this.sending = false
            if (response.data.error == false) {
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
}
</script>

<style scoped>

</style>