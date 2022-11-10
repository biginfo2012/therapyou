<template>
  <v-app-bar
      app
      clipped-left
      clipped-right
      :color="navbarColor"
      :dark="navbarColor !== '#fafafa'"
      class="app-navbar">
    <!-- ---------------------------------------------- -->
    <!---/Toggle sidebar part -->
    <!-- ---------------------------------------------- -->
    <div>
      <v-app-bar-nav-icon
          @click="$vuetify.breakpoint.smAndDown
            ? setSidebarDrawer(!Sidebar_drawer)
            : $emit('input', !value)"/>
    </div>
    <!---/Toggle sidebar part -->

    <v-spacer/>
    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- ---------------------------------------------- -->

    <!-- ---------------------------------------------- -->
    <!-- Dark Mode -->
    <!-- ---------------------------------------------- -->
    <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
        min-width="150">
      <template v-slot:activator="{ on }">
        <div v-on="on" class="mt-1">
          <img v-if="$vuetify.theme.dark" src="@/assets/images/icons/night-mode.png" width="24" class="mr-8" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
          <img v-if="!$vuetify.theme.dark" src="@/assets/images/icons/brightness.png" width="24" class="mr-8" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        </div>

<!--        <v-switch v-on="on"-->
<!--            v-model="$vuetify.theme.dark"-->
<!--            class="mr-8"-->
<!--            hide-details-->
<!--            primary-->
<!--            label="Dark"-->
<!--        />-->
      </template>
    </v-menu>

    <!-- ---------------------------------------------- -->
    <!-- Languages -->
    <!-- ---------------------------------------------- -->
    <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
        min-width="150">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="mr-4">
          <img v-if="$vuetify.theme.dark" class="locale" :alt="$i18n.locale.toUpperCase()" src="@/assets/images/icons/language-light.png" draggable="false" width="24"/>
          <img v-if="!$vuetify.theme.dark" class="locale" :alt="$i18n.locale.toUpperCase()" src="@/assets/images/icons/language-dark.png" draggable="false" width="24"/>
        </v-btn>
      </template>

      <v-list class="pa-1">
        <v-list-item
            class="px-3"
            v-for="(l,index) in localeOptions" :key="index" @click="changeLocale(l)">
          <v-list-item-title>
            <div class="d-flex align-center py-2 pl-3">
              <div class="ml-2">
                <h4 class="font-weight-medium">{{ l.name }}</h4>
              </div>
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- ---------------------------------------------- -->
    <!-- Notification -->
    <!-- ---------------------------------------------- -->
    <v-menu
        bottom left offset-y
        origin="top right"
        transition="scale-transition"
        min-width="300"
        v-if="showNoti"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="mr-3">
          <div v-if="notiCnt != 0">
            <v-badge color="success" dot offset-x="5" offset-y="5">
              <feather type="bell" class="feather-sm"></feather>
            </v-badge>
          </div>
          <div class="mt-2" v-else>
            <feather type="bell" class="feather-sm"></feather>
          </div>
        </v-btn>
      </template>

      <v-list class="pa-3">
        <h4 class="font-weight-medium fs-18">
          {{$t('menu.noti')}}
          <v-chip class="ma-2" label small color="warning"> {{notiCnt}} {{ $t('general.new') }} </v-chip>
        </h4>
        <v-list-item
            class="px-0"
            v-for="(item, i) in notifications"
            :key="i">
          <v-list-item-title>
            <div class="d-flex align-center py-4 px-3 border-bottom">
              <div class="ml-2">
                <span
                    class="grey--text subtitle-2 descpart d-block text-truncate font-weight-regular">{{ item.text }}</span>
              </div>
            </div>
          </v-list-item-title>
        </v-list-item>
        <v-btn block depressed color="secondary" class="mt-4 py-4"  @click="goNoti">{{$t('noti.all')}}</v-btn>
      </v-list>
    </v-menu>

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
        min-width="280">
      <template v-slot:activator="{ on }">
        <v-btn
            v-on="on"
            class="pa-0 px-1"
            elevation="0"
            color="transparent"
            plain
            :ripple="false">
          <v-avatar size="35">
            <img :src="userInfo.profileImage" alt="Julia"/>
          </v-avatar>
        </v-btn>
      </template>

      <v-list class="pa-8">
        <h4 class="font-weight-medium fs-18">{{ $t('header.profile') }}</h4>
        <div class="d-flex align-center my-4" @click="goPage" style="cursor: pointer">
          <img :src="userInfo.profileImage"
               alt="Julia" class="rounded-circle" width="90"/>
          <div class="ml-4">
            <h4 class="font-weight-medium fs-18">{{ userInfo.name }}</h4>
            <span class="subtitle-2 font-weight-light">{{ userInfo.role }}</span>
          </div>
        </div>
        <v-btn block depressed color="success" class="mt-4 py-4" @click="logout">Logout</v-btn>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
// Utilities
import {mapState, mapMutations, mapActions} from "vuex"
import {getLoginInfo, setLocale, isLoggedInAsUser} from "@/utils"
import {localeOptions} from "@/constants/config"
import {getNotiList} from "@/api";

export default {
  name: "VerticalHeader",

  components: {},

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      showSearch: false,
      drawer: false,
      group: null,
      localeOptions,
      showNoti: false,
      notiCnt: 0,
      timer: null,
      userInfo: {
        id: 0,
        name: "",
        role: "",
        profileImage: ""
      },
      notifications: [],
    }
  },

  computed: {
    ...mapState(["navbarColor", "Sidebar_drawer"]),
  },

  methods: {
    ...mapMutations({
      setSidebarDrawer: "SET_SIDEBAR_DRAWER",
    }),
    ...mapActions(['setLang']),

    logout() {
      this.$store.dispatch('signOut')
    },
    changeLocale(l) {
      let locale = l.id
      this.setLang(locale)
    },
    getLocaleIcon() {
      const locale = this.$i18n.locale
      for (let l of localeOptions) {
        if (l.id === locale) return l.icon
      }
      return localeOptions[1].icon
    },
    goPage() {
      this.$router.push('/profile')
    },
    goNoti() {
      this.$router.push('/user/notification/list')
    },
    setLanguageInfo() {
      setLocale(this.$i18n.locale)
    },
    getNotiData(){
      let data = {
        therapistId:  getLoginInfo().cognitoId,
        alreadyNotified: false
      }
      getNotiList(data).then((response) => {
        if (response.data.msg == "success") {
          this.notifications = response.data.data.notifications
          this.notiCnt = this.notifications.length
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
    '$i18n.locale'(to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path)
      }
    },
  },
  mounted() {
    let loginInfo = getLoginInfo()
    this.userInfo.id = loginInfo.id
    this.userInfo.name = loginInfo.name
    this.userInfo.role = loginInfo.role == 2 ? "Admin" : "Therapist"
    this.userInfo.profileImage = loginInfo.profileImage
    this.setLanguageInfo()
    this.showNoti = isLoggedInAsUser()
    if(this.showNoti){
      this.getNotiData()
      this.timer = setInterval(() => {
        this.getNotiData()
      }, 60 *1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.hidelogo {
  display: none;
}

.searchinput {
  position: absolute;
  width: 100%;
  margin: 0;
  left: 0;
  z-index: 10;
  padding: 0 15px;
}

.descpart {
  max-width: 220px;
}

@media (min-width: 960px) {
  .v-application--is-ltr {
    .app-navbar.v-sheet {
      width: calc(100% - 265px) !important;
      margin-left: auto;
    }
  }
  .v-application--is-rtl {
    .app-navbar.v-sheet {
      width: calc(100% - 265px) !important;
      margin-left: unset;
      margin-right: auto;
    }
  }
}
</style>
