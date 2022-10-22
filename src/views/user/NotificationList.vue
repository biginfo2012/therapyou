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
              </v-toolbar>
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
import {getNotiList} from "@/api"

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
      loading: false,
      items: [],
      headers: [
        {
          text: this.$t('noti.title'),
          align: "start",
          sortable: true,
          value: "title"
        },
        {
          text: this.$t('noti.desc'),
          align: "start",
          sortable: false,
          value: "desc"
        }
      ],
      datas: [],
      loginInfo: getLoginInfo()
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
        cognitoId: this.loginInfo.cognitoId,
      }
      getNotiList(data).then((response) => {
        if (response.data.msg == "success") {
          this.datas = response.data.data.notificationList
          this.loading = false
        }
      }).catch(error => {
        this.loading = false
        this.handle(error)
      })
    }
  }
}
</script>

<style scoped>

</style>