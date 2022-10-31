<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <BaseCard :heading="$t('noti.notis')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{$t('noti.list')}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending"
                         style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text class="pb-0">
                      <v-container>
                        <v-form ref="form">
                          <v-row>
<!--                            <v-col cols="12" sm="12" md="12" class="pb-0">-->
<!--                              <v-text-field-->
<!--                                  v-model="editedItem.therapistId"-->
<!--                                  required outlined-->
<!--                                  :label="$t('noti.title')"-->
<!--                              ></v-text-field>-->
<!--                            </v-col>-->
                            <v-col cols="12" sm="12" md="12" class="pb-0">
                              <v-textarea
                                  v-model="editedItem.text"
                                  required outlined
                                  :label="$t('noti.list')"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="px-10 pb-3">
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close" :disabled="sending">{{ $t('general.cancel') }}</v-btn>
                      <v-btn color="blue darken-1" text @click="confirm" :disabled="sending">{{ $t('general.confirm') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon v-if="item.notified != 1" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
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
import {getLoginInfo} from "@/utils"
import {confirmNoti, getNotiList} from "@/api"

export default {
  name: "NotificationList",
  data: function () {
    return {
      page: {
        title: this.$t('noti.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('noti.list'),
          disabled: false,
          to: "#",
        }
      ],
      dialog: false,
      loading: false,
      sending: false,
      items: [],
      headers: [
        // {
        //   text: this.$t('noti.title'),
        //   align: "start",
        //   sortable: true,
        //   value: "therapistId"
        // },
        {
          text: this.$t('noti.desc'),
          align: "start",
          sortable: false,
          value: "text"
        },
        {text: this.$t('appointment.action'), value: "actions", sortable: false}
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        therapistId: "",
        text: "",
        notified: null
      },
      defaultItem: {
        id: 0,
        therapistId: "",
        text: "",
        notified: null
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
    },
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getData(){
      this.loading = true
      let data = {
        therapistId: this.loginInfo.cognitoId,
        alreadyNotified: true
      }
      getNotiList(data).then((response) => {
        if (response.data.msg == "success") {
          this.datas = response.data.data.notifications
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })
    },
    editItem(item) {
      this.editedIndex = this.datas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    confirm() {
      // if(this.editedItem.notified == 1){
      //   this.close()
      //   return
      // }
      this.sending = true
      let data = {
        notificationId: this.editedItem.id,
      }
      confirmNoti(data).then((response) => {
        this.sending = false
        if (response.data.msg == "success") {
          this.close()
          this.getData()
        }
      }).catch(error => {
        this.sending = false
        this.handle(error)
      })
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
  }
}
</script>

<style scoped>

</style>