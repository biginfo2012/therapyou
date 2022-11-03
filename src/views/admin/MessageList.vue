<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon"></BaseBreadcrumb>
    <BaseCard :heading="$t('mail.mails')">
      <div>
        <v-list-item-subtitle class="text-wrap">
        </v-list-item-subtitle>
        <div class="mt-4">
          <v-container>
            <v-form ref="search_form">
              <v-row>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-autocomplete :items="items" item-text="username" outlined dense
                            item-value="cognitoId" :label="$t('appointment.user-name')"
                            v-model="searchItem.userId" class="mt-0 pt-0"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="4" class="py-0">
                  <v-btn color="success" class="mt-0 mr-3" @click="reset">{{ $t('general.reset') }}</v-btn>
                  <v-btn color="success" class="mt-0" @click="getData">{{ $t('general.search') }}</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-data-table :headers="headers" :items="datas" sort-by="calories" class="border" :loading="loading" loading-text="Loading...">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>{{ $t('mail.my')}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <img src="@/assets/images/icons/logo-icon.gif" width="80" v-show="sending" style="position: absolute;left: calc(50% - 40px);top: calc(50% - 40px);" alt="Sending"/>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12" class="pb-0">
                            <v-select :items="items" item-text="username" outlined disabled
                                      item-value="cognitoId" :label="$t('appointment.user-name')"
                                      v-model="editedItem.cognitoId" class="mt-0 pt-0"></v-select>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" class="pb-0">
                            <v-textarea
                                v-model="editedItem.text"
                                outlined required auto-grow disabled
                                :label="$t('mail.content')"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" class="pb-0">
                            <v-textarea
                                v-model="editedItem.content"
                                :rules="fieldRules"
                                outlined required auto-grow
                                :label="$t('mail.answer')"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close" :disabled="sending">{{ $t('general.cancel') }}</v-btn>
                      <v-btn color="blue darken-1" text @click="save" :disabled="sending">{{ $t('general.reply') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon v-if="item.isRead != 1" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
<!--              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>-->
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
import { getLoginInfo } from '@/utils'
import {deleteMessage, getMessageList, getMessageListByUser, getUserList, replyMessage} from "@/api"
export default {
  name: "MessageList",
  data: function () {
    return {
      page: {
        title: this.$t('mail.list'),
      },
      breadcrumbs: [
        {
          text: this.$t('mail.list'),
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
          text: this.$t('appointment.user-name'),
          align: "start",
          sortable: true,
          value: "fromUser"
        },
        {
          text: this.$t('mail.content'),
          align: "start",
          sortable: true,
          value: "text"
        },
        { text: this.$t('appointment.action'), value: "actions", sortable: false }
      ],
      datas: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        therapistId: "",
        userId: "",
        content: "",
        text: ""
      },
      defaultItem:{
        id: 0,
        therapistId: "",
        userId: "",
        content: "",
        text: ""
      },
      searchItem:{
        userId: ""
      },
      fieldRules:[
        v => !!v || this.$t('error-messages.field-required'),
      ],
      loginInfo: getLoginInfo()
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? this.$t('general.new') : this.$t('general.reply')
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
      this.getUserData()
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
    getData() {
      this.loading = true
      let data = {
        therapistId: this.loginInfo.cognitoId,
        alreadyRead: true
      }
      this.datas = []
      if (this.searchItem.userId != "") {
        data = {
          therapistId: this.loginInfo.cognitoId,
          userId: this.searchItem.userId,
          alreadyRead: true
        }
        getMessageListByUser(data).then((response) => {
          if (response.data.msg == "success") {
            this.datas = response.data.data.messages
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.handle(error)
        })
      }
      else{
        getMessageList(data).then((response) => {
          if (response.data.msg == "success") {
            this.datas = response.data.data.messages
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.handle(error)
        })
      }
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
            tmp['id'] = users[i]['id']
            tmp['username'] = users[i]['firstName'] + ' ' + users[i]['lastName']
            tmp['cognitoId'] = users[i]['cognitoId']
            this.items.push(tmp)
          }
          if(this.datas != []){
            for(let i = 0; i < this.datas.length; i++){
              let fromUser = this.datas[i]['fromUser']
              for(let j = 0; j < this.items.length; j++){
                console.log(fromUser)
                if(this.items[j]['id'] == fromUser){
                  this.datas[i]['fromUser'] = this.items[j]['username']
                  break
                }
              }
            }
            console.log(this.datas)
          }
        }
      }).catch(error => {
        this.handle(error)
      })
    },

    editItem(item) {
      this.editedIndex = this.datas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
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
        deleteMessage(data).then((response) => {
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
        let data = {
          messageId: this.editedItem.id,
          content: this.editedItem.content
        }
        replyMessage(data).then((response) => {
          this.sending = false
          if (response.data.msg == "success") {
            this.close()
            this.getData()
          }
        }).catch(error => {
          this.sending = false
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