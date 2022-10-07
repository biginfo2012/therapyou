<template>
  <v-app-bar
    class="horizontal-header"
    app
    clipped-left
    clipped-right
    :color="navbarColor"
    :dark="navbarColor !== '#fafafa' && !$vuetify.theme.dark"
  >
    <v-container class="py-0 d-flex align-center">
      <div class="d-none d-md-block">
        <!-- ---------------------------------- -->
        <!--- light Logo part -->
        <!-- ---------------------------------- -->
        <v-toolbar-title
          class="align-center d-flex"
          v-if="navbarColor == '#fafafa' && !$vuetify.theme.dark"
        >
          <img src="../../../assets/images/logos/logo-dark.svg" />
        </v-toolbar-title>
        <!-- ---------------------------------- -->
        <!---  dark Logo part -->
        <!-- ---------------------------------- -->
        <v-toolbar-title class="align-center d-flex" v-else>
          <img src="../../../assets/images/logos/logo-white.svg" />
        </v-toolbar-title>
      </div>
      <!-- ---------------------------------- -->
      <!--- end Logo part -->
      <!-- ---------------------------------- -->
      <!-- ---------------------------------- -->
      <!---/Toggle sidebar part -->
      <!-- ---------------------------------- -->
      <div @click="showhideLogo" class="d-block d-lg-none md-none">
        <v-app-bar-nav-icon
          @click="
            $vuetify.breakpoint.smAndDown
              ? setSidebarDrawer(!Sidebar_drawer)
              : $emit('input', !value)
          "
        />
      </div>
      <!-- ---------------------------------- -->
      <!---/Toggle sidebar part -->
      <!-- ---------------------------------- -->
      <!---Search part -->
      <!-- ---------------------------------- -->
      <v-btn icon class="mr-1 d-sm-block d-none" @click="searchbox">
        <!-- <v-icon>mdi-magnify</v-icon> -->
        <feather type="search" class="feather-sm"></feather>
      </v-btn>

      <v-card v-if="showSearch" class="searchinput">
        <template>
          <v-text-field
            placeholder="Search & hit enter"
            class="mt-3 mb-0"
            append-icon="mdi-close"
            @click:append="searchbox"
          ></v-text-field>
        </template>
      </v-card>
      <!-- ---------------------------------- -->
      <!---/Search part -->
      <!-- ---------------------------------- -->
      <v-spacer />
      <!-- ---------------------------------- -->
      <!---right part -->
      <!-- ---------------------------------- -->
      <!---Messages -->
      <!-- ---------------------------------- -->
      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
        min-width="385"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-badge color="secondary" dot offset-x="4" offset-y="4">
              <feather type="message-square" class="feather-sm"></feather>
            </v-badge>
          </v-btn>
        </template>

        <v-list class="pa-8">
          <h4 class="font-weight-medium title">
            Messages
            <v-chip class="ma-2" label small color="secondary"> 5 new </v-chip>
          </h4>
          <v-list-item
            v-for="(item, i) in messages"
            class="px-0"
            :key="i"
            @click="href"
          >
            <v-list-item-title>
              <div class="d-flex align-center py-4 px-3 border-bottom">
                <div class>
                  <v-badge
                    bordered
                    bottom
                    :color="item.avatarstatus"
                    dot
                    offset-x="20"
                    offset-y="40"
                  >
                    <v-avatar size="42" class="mr-3"
                      ><img
                        :src="require(`@/assets/images/users/${item.image}`)"
                        :alt="item.image"
                    /></v-avatar>
                  </v-badge>
                </div>
                <div class="ml-3">
                  <h4 class="font-weight-medium">{{ item.title }}</h4>
                  <span
                    class="text--secondary subtitle-2 descpart d-block text-truncate font-weight-regular"
                    >{{ item.desc }}</span
                  >
                  <small class="text--secondary caption">{{ item.time }}</small>
                </div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-btn block depressed color="primary" class="mt-4 py-4"
            >See all Messages</v-btn
          >
        </v-list>
      </v-menu>
      <!-- ---------------------------------- -->
      <!-- Notifications -->
      <!-- ---------------------------------- -->
      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
        min-width="385"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-badge color="primary" dot offset-x="5" offset-y="5">
              <feather type="bell" class="feather-sm"></feather>
            </v-badge>
          </v-btn>
        </template>

        <v-list class="pa-8">
          <h4 class="font-weight-medium title">
            Notifications
            <v-chip class="ma-2" label small color="warning"> 5 new </v-chip>
          </h4>
          <v-list-item
            class="px-0"
            v-for="(item, i) in notifications"
            :key="i"
            @click="href"
          >
            <v-list-item-title>
              <div class="d-flex align-center py-4 px-3 border-bottom">
                <div class>
                  <v-btn
                    :color="item.color"
                    fab
                    small
                    elevation="0"
                    class="mr-3"
                  >
                    <feather :type="item.icon" size="18"></feather>
                  </v-btn>
                </div>
                <div class="ml-2">
                  <h4 class="font-weight-medium">{{ item.title }}</h4>
                  <span
                    class="grey--text subtitle-2 descpart d-block text-truncate font-weight-regular"
                    >{{ item.desc }}</span
                  >
                </div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-btn block depressed color="secondary" class="mt-4 py-4"
            >See all Notifications</v-btn
          >
        </v-list>
      </v-menu>
      <!-- ---------------------------------- -->
      <!-- User Profile -->
      <!-- ---------------------------------- -->
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
              <h4 class="font-weight-medium fs-18">Julia Roberts</h4>
              <span class="subtitle-2 font-weight-light">Administrator</span>
              <div class="d-flex align-center">
                <feather
                  type="mail"
                  size="16"
                  class="d-flex grey--text"
                ></feather>
                <span class="subtitle-2 font-weight-light ml-1"
                  >info@flexy.com</span
                >
              </div>
            </div>
          </div>
          <v-list-item
            class="px-0"
            v-for="(item, i) in userprofile"
            :key="i"
            @click="href"
          >
            <v-list-item-title>
              <div class="d-flex align-center py-4 px-3 border-bottom">
                <div class>
                  <v-btn
                    :class="'bg-light-' + item.color"
                    fab
                    elevation="0"
                    class="mr-3"
                  >
                    <span :class="item.color + '--text'">
                      <feather :type="item.icon" width="20"></feather>
                    </span>
                  </v-btn>
                </div>
                <div class="ml-2">
                  <h4 class="font-weight-medium">{{ item.title }}</h4>
                  <span
                    class="grey--text subtitle-2 descpart d-block text-truncate font-weight-regular"
                    >{{ item.desc }}</span
                  >
                </div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-btn block depressed color="secondary" class="mt-4 py-4"
            >Logout</v-btn
          >
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>
<script>
// Utilities
import { mapState, mapMutations } from "vuex";
export default {
  name: "HorizontalHeader",

  components: {},

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showLogo: true,
    showSearch: false,
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
    showhideLogo: function () {
      this.showLogo = !this.showLogo;
    },
    searchbox: function () {
      this.showSearch = !this.showSearch;
    },
  },
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
</style>
