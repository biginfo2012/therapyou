<template>
  <v-navigation-drawer
      v-model="Sidebar_drawer"
      :dark="SidebarColor !== 'white'"
      :color="SidebarColor"
      mobile-breakpoint="960"
      clipped
      :right="$vuetify.rtl"
      mini-variant-width="70"
      :expand-on-hover="expandOnHover"
      app
      id="main-sidebar"
      v-bar
      width="265"
  >
    <v-list expand nav>
      <!-- ---------------------------------------------- -->
      <!---Logo part -->
      <!-- ---------------------------------------------- -->

      <!---Dark Logo part -->
      <v-toolbar-title
          class="align-center d-flex mb-5"
          v-if="SidebarColor == 'white' && !$vuetify.theme.dark"
      >
        <img src="@/assets/images/icons/logo-icon.png" class="mt-2" width="40"/>
      </v-toolbar-title>
      <v-toolbar-title class="align-center d-flex mb-5" v-else>
        <img src="@/assets/images/icons/logo-icon.png" class="mt-2" width="40"/>
      </v-toolbar-title>
      <!-- ---------------------------------------------- -->
      <!---Logo part -->
      <!-- ---------------------------------------------- -->
      <template v-for="(item, i) in items">
        <!---If Sidebar Caption -->
        <v-row v-if="item.header" :key="item.header" align="center">
          <v-col cols="12">
            <v-subheader v-if="item.header" class="d-block text-truncate">{{
                item.header
              }}
            </v-subheader>
          </v-col>
        </v-row>
        <!---If Sidebar Caption -->
        <BaseItemGroup
            v-else-if="item.children"
            :key="`group-${i}`"
            :item="item"
        ></BaseItemGroup>

        <BaseItem v-else :key="`item-${i}`" :item="item"/>
      </template>
      <!---Sidebar Items -->
    </v-list>
    <!--- Buy Now -->
  </v-navigation-drawer>
</template>

<script>
import {mapState} from "vuex"
import VerticalSidebarItems from "./VerticalSidebarItems"
import VerticalSidebarItemsUser from "./VerticalSidebarItemsUser"
import VerticalSidebarItemsClient from "./VerticalSidebarItemsClient"
import {isLoggedInAsAdmin, isLoggedInAsUser} from "@/utils"

export default {
  name: "Vertical-Sidebar",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: VerticalSidebarItems,
      showLogo: true,
    }
  },
  computed: {
    ...mapState(["SidebarColor", "SidebarBg"]),
    Sidebar_drawer: {
      get() {
        return this.$store.state.Sidebar_drawer
      },
      set(val) {
        this.$store.commit("SET_SIDEBAR_DRAWER", val)
      },
    },
  },
  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val)
    },
  },

  methods: {},
  mounted() {
    if (isLoggedInAsUser()) {
      this.items = VerticalSidebarItemsUser
    }
    else if(isLoggedInAsAdmin()){
      this.items = VerticalSidebarItems
    }
    else{
      this.items = VerticalSidebarItemsClient
    }
  }
}
</script>
<style lang="scss">
.hidelogo {
  display: none;
}

#main-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);

  .v-navigation-drawer__border {
    display: none;
  }

  .v-list {
    padding: 8px 15px;
  }

  .v-list-item {
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;
    }
  }

  .sidebar-footer {
    position: relative;
    border-radius: 9px;
    padding: 20px 25px;

    .buy-now-img {
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .sidebar-footer-text {
      position: relative;
    }
  }
}
</style>
