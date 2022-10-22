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
        <v-switch v-on="on"
            v-model="$vuetify.theme.dark"
            class="mr-5"
            hide-details
            primary
            label="Dark"
        />
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
        <v-btn icon v-on="on" class="mr-5">
          <img class="locale" :alt="$i18n.locale.toUpperCase()" src="@/assets/images/icons/language.png" draggable="false" width="32"/>
          <span class="name ml-2 mr-3">{{ $i18n.locale.toUpperCase() }}</span>
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
import {getLoginInfo, setLocale} from "@/utils"
import {localeOptions} from "@/constants/config"

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
      userInfo: {
        id: 0,
        name: "",
        role: "",
        profileImage: ""
      },
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
    setLanguageInfo() {
      setLocale(this.$i18n.locale)
    },
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
