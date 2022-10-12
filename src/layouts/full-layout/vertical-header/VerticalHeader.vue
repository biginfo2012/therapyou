<template>
  <v-app-bar
    app
    clipped-left
    clipped-right
    :color="navbarColor"
    :dark="navbarColor !== '#fafafa'"
    class="app-navbar"
  >
    <!-- ---------------------------------------------- -->
    <!---/Toggle sidebar part -->
    <!-- ---------------------------------------------- -->
    <div>
      <v-app-bar-nav-icon
        @click="
          $vuetify.breakpoint.smAndDown
            ? setSidebarDrawer(!Sidebar_drawer)
            : $emit('input', !value)
        "
      />
    </div>
    <!---/Toggle sidebar part -->

    <v-spacer />
    <!-- ---------------------------------------------- -->
    <!---right part -->
    <!-- ---------------------------------------------- -->

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      min-width="385"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          class="pa-0 px-1"
          elevation="0"
          color="transparent"
          plain
          :ripple="false"
        >
          <v-avatar size="35">
            <img src="@/assets/images/users/user2.jpg" alt="Julia" />
          </v-avatar>
        </v-btn>
      </template>

      <v-list class="pa-8">
        <h4 class="font-weight-medium fs-18">User Profile</h4>
        <div class="d-flex align-center my-4">
          <img
            src="@/assets/images/users/user2.jpg"
            alt="Julia"
            class="rounded-circle"
            width="90"
          />
          <div class="ml-4">
            <h4 class="font-weight-medium fs-18">{{ userInfo.name}}</h4>
            <span class="subtitle-2 font-weight-light">{{ userInfo.role }}</span>
          </div>
        </div>
        <v-btn block depressed color="secondary" class="mt-4 py-4" @click="logout">Logout</v-btn>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
// Utilities
import { mapState, mapMutations } from "vuex";
import {getLoginInfo} from "@/utils";
export default {
  name: "VerticalHeader",

  components: {},

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showSearch: false,
    drawer: false,
    group: null,
    messages: [
      {
        image: "1.jpg",
        avatarstatus: "success",
        title: "Romen Joined the Team!",
        desc: "Congratulate him",
        time: "9:30 AM",
      },
      {
        image: "2.jpg",
        avatarstatus: "warning",
        title: "New message received",
        desc: "Salma sent you new message",
        time: "9:08 AM",
      },
      {
        image: "3.jpg",
        avatarstatus: "error",
        title: "New Payment received",
        desc: "Check your earnings",
        time: "9:08 AM",
      },
      // {
      //   image: "4.jpg",
      //   avatarstatus: "success",
      //   title: "Jolly completed tasks",
      //   desc: "Assign her new tasks",
      //   time: "9:08 AM",
      // },
    ],
    notifications: [
      {
        color: "error",
        icon: "home",
        title: "Luanch Admin",
        desc: "Just see the my new admin!",
      },
      {
        color: "primary",
        icon: "calendar",
        title: "Event today",
        desc: "Just a reminder that you have event",
      },
      {
        color: "success",
        icon: "settings",
        title: "Settings",
        desc: "You can customize this template as you want",
      },
      {
        color: "secondary",
        icon: "users",
        title: "Johny John",
        desc: "Assign her new tasks",
      },
    ],
    userprofile: [
      {
        color: "error",
        icon: "dollar-sign",
        title: "My Profile",
        desc: "Account Settings",
      },
      {
        color: "success",
        icon: "shield",
        title: "My Inbox",
        desc: "Messages & Emails",
      },
      {
        color: "secondary",
        icon: "credit-card",
        title: "My Tasks",
        desc: "To-do and Daily Tasks",
      },
    ],
    userInfo:{
      id: 0,
      name: "",
      role: "",
    },
    href() {
      return undefined;
    },
  }),

  computed: {
    ...mapState(["navbarColor", "Sidebar_drawer"]),
  },

  methods: {
    ...mapMutations({
      setSidebarDrawer: "SET_SIDEBAR_DRAWER",
    }),
    logout(){
      this.$store.dispatch('signOut');
    }
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  mounted() {
    let loginInfo = getLoginInfo();
    this.userInfo.id = loginInfo.id
    this.userInfo.name = loginInfo.name
    this.userInfo.role = loginInfo.role == 2 ? "Super Admin" : "Therapist"
  }
};
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
