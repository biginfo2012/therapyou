<template>
  <v-container fluid class="chat-app common-left-right">
    <v-row>
      <v-col cols="12" sm="12">
        <v-card class="d-flex flex-row">
          <div>

            <!---/Left chat list -->
            <v-navigation-drawer left v-model="drawer" class="flex-shrink-0">
              <div class="px-3 border-bottom"><v-text-field placeholder="Search contact" hide-details outlined class="my-2" v-model="handleSearchInput"></v-text-field></div>
              <v-list nav class="hightauto" >
                <v-list-item v-for="(conversation, i) in filteredList" :key="i" @click="(e) => openMessages(conversation, e)" :class="isActive ? 'active':'s'">
                  <v-avatar size="42" class="mr-3"><img src="@/assets/images/icons/logo-icon.png"/></v-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <h4>{{conversation.name}}</h4>
                      <span class="caption">{{conversation.lastMessage}}</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
          </div>
          <!---/Left chat list -->
          <!---right chat conversation -->
          <div class="chat-right-part">
            <template  v-if="conversation">
              <!---conversation header-->
              <div class="chat-topbar d-flex px-3 py-3 align-center">
                <div>
                  <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-block d-lg-none mr-2" />
                </div>
                <div class="user-about">
                  <h6>{{conversation.name}}</h6>
                </div>
              </div>
              <!---conversation header-->
              <!---Chat Room-->
              <div class="">
                <div class="chat-room px-3 py-3">
                  <div class="d-flex align-center mb-3" light v-for="message in conversation.messages" :key="message.id" :class="{fromMe: message.fromMe, 'messageItem': true}">
                    <div class="thumb">
                      <v-avatar size="37" class="mx-2" v-if="message.fromMe" ><img :src="loginInfo.profileImage" alt="..."/></v-avatar>
                      <v-avatar size="37"  class="mx-2" v-else><img src="@/assets/images/icons/logo-icon.png" alt="..."/>
                      </v-avatar>
                    </div>
                    <v-chip :color="message.fromMe ? 'primary': ''">{{message.text}}</v-chip>
                  </div>
                </div>
              </div>
              <!---Chat Room-->
              <div class="pa-3 border-top">
                <v-textarea name="input-4-1" rows="2" placeholder="Type and hit Enter" outlined v-model="conversation.replyContent"></v-textarea>
                <v-btn color="success" class="mr-2 text-capitalize" @click="addMessageBtn" :loading="loading">
                  {{ $t('mail.send') }}
                  <span slot="loader">...</span>
                </v-btn>
              </div>
            </template>
            <template v-else>
              <div class="d-flex justify-center hightauto align-center">
                <h4>Start conversation</h4>
              </div>
            </template>
          </div>
          <!---right chat conversation -->
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { getLoginInfo } from '@/utils'
import {getListUsers, getMessageListByUser, replyMessage} from "@/api"
export default {
  name: "MessageList",
  data: function () {
    return {
      drawer:null,
      doNotClose:true,
      handleSearchInput:"",
      UsersList: [],
      chatUserActive: true,
      conversation: "",
      sendMessage:" ",
      isActive: false,
      windowWidth: window.innerWidth,
      loginInfo: getLoginInfo(),
      timer: null,
      loading: false,
      loader: false,
    }
  },
  computed: {
    filteredList() {
      return this.UsersList.filter(user => {
        return user.name.toLowerCase().includes(this.handleSearchInput.toLowerCase())
      })
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.initialize()
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize);
    })
    this.setSidebarWidth()
  },
  mounted() {
    // this.timer = setInterval(() => {
    //   this.getListUser()
    // }, 60 *1000)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    initialize() {
      this.getListUser()
    },
    handle(error) {
      console.log(error)
      if (error.response.status == 401) {
        this.$store.dispatch('tryAutoSignIn')
      } else {
        //this.$dialog.notify.error(error.response.data.msg)
      }
    },
    getListUser() {
      let data = {
        therapistId: this.loginInfo.cognitoId
      }
      this.UsersList = []
      getListUsers(data).then((response) => {
        if (response.data.error == false){
          let users = response.data.data.users
          for(let i = 0; i < users.length; i++){
            let tmp = {}
            let data = users[i]
            tmp['name'] = data['firstName'] + ' ' + data['lastName']
            tmp['userId'] = data['cognitoId']
            tmp['replyContent'] = ""
            tmp['messages'] = []
            tmp['lastMessage'] = data['lastMessage']['text']
            this.UsersList.push(tmp)
          }
        }
      }).catch(error => {
        this.handle(error)
      })
    },

    selectedchat: function() {
      this.isActive = !this.isActive;
      // some code to filter users
    },
    openMessages(conversation) {
      let data = {
        therapistId: this.loginInfo.cognitoId,
        userId: conversation.userId,
        alreadyRead: false
      }
      conversation.messages = []
      getMessageListByUser(data).then((response) => {
        if (response.data.error == false){
          let messages = response.data.data.messages
          for(let i = 0; i < messages.length; i++){
            let tmp = {}
            let data = messages[i]
            tmp['id'] = data['id']
            tmp['text'] = data['text']
            tmp['fromMe'] = data['fromUser'] == 1 ? false : true
            conversation.messages.push(tmp)
          }
          Vue.set(this, 'conversation', conversation);
        }
      }).catch(error => {
        this.handle(error)
      })
    },

    addMessage(e) {
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]
      console.log(e)
      if (e.key === 'Enter' && e.target.value) {
        const value = {
          text: e.target.value,
          fromMe: true,
        }
        let data = {
          therapistId: this.loginInfo.cognitoId,
          userId: this.conversation.userId,
          content: e.target.value
        }
        replyMessage(data).then((response) => {
          this[l] = false
          this.loader = null
          if (response.data.error == false){
            Vue.set(this, 'conversation', Object.assign({}, this.conversation, {
              messages: [
                ...this.conversation.messages || [],
                value,
              ],
            }))
          }
          e.target.value = ''
          this.conversation.replyContent = ''
        }).catch(error => {
          e.target.value = ''
          this.conversation.replyContent = ''
          this[l] = false
          this.loader = null
          this.handle(error)
        })
      }
    },

    addMessageBtn(){
      this.loader = 'loading'
      const l = this.loader
      this[l] = !this[l]
      if (this.conversation.replyContent != "") {
        const value = {
          text: this.conversation.replyContent,
          fromMe: true,
        }
        let data = {
          therapistId: this.loginInfo.cognitoId,
          userId: this.conversation.userId,
          content: this.conversation.replyContent
        }
        replyMessage(data).then((response) => {
          this[l] = false
          this.loader = null
          if (response.data.error == false){
            Vue.set(this, 'conversation', Object.assign({}, this.conversation, {
              messages: [
                ...this.conversation.messages || [],
                value,
              ],
            }))
          }
          this.conversation.replyContent = ''
        }).catch(error => {
          this.conversation.replyContent = ''
          this.loader = null
          this[l] = false
          this.handle(error)
        })
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if(this.windowWidth < 1170) {
        this.chatSidebarActive = this.doNotClose = false;
      }else {
        this.chatSidebarActive = this.doNotClose =  true;
      }
    }
  }
}
</script>

<style lang="scss">
.chat-app{
  overflow:hidden;
  .v-navigation-drawer__border{
    width:0;
  }
  .chat-right-part{
    width: 100%;
    border-left:1px solid rgba(0,0,0,0.1);
    .chat-topbar{
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
  }
  .chat-room {
    min-height: calc(100vh - 385px);
    .fromMe {
      -webkit-box-pack: start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: reverse;
      -ms-flex-direction: row-reverse;
      flex-direction: row-reverse;
    }
  }
  .hightauto{
    min-height: calc(100vh - 360px);
  }
}

</style>