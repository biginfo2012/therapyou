<template>
  <v-navigation-drawer
    v-model="Customizer_drawer"
    app
    temporary
    :right="!$vuetify.rtl"
  >
    <div v-bar class="vs-scrollable" style="height: calc(100vh - 20px)">
      <div>
        <!---Layout Type -->
        <div class="px-4 py-4">
          <span>Horizontal</span>
          <v-switch
            v-model="setHorizontalLayout"
            hide-details
            class="mt-2"
            label="Horizontal"
          ></v-switch>
        </div>
        <v-divider></v-divider>

        <!---Theme Color -->
        <div class="px-4 py-4">
          <span>Theme</span>
          <v-switch
            v-model="$vuetify.theme.dark"
            class="mt-2"
            hide-details
            primary
            label="Dark"
          />
        </div>
        <v-divider></v-divider>

        <div class="px-4 py-4">
          <span>RTL</span>
          <v-switch
            v-model="$vuetify.rtl"
            class="mt-2"
            hide-details
            primary
            label="Right to Left"
          />
        </div>
        <v-divider></v-divider>
        <!---Sidebar Type -->
        <div class="px-4 py-4" v-if="!setHorizontalLayout">
          <span>Mini Sidebar</span>
          <v-switch
            v-model="internalValue"
            hide-details
            class="mt-2"
            label="Mini variant"
          ></v-switch>
        </div>
        <v-divider></v-divider>
        <!---Navbar (Topbar) Color -->
        <div class="px-4 py-4">
          <span>Topbar Colors</span>
          <v-item-group v-model="setNavbarColor">
            <v-item
              v-for="color in navbarColors"
              :key="color"
              :value="color"
              class="mt-2"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-sidebar_active'"
                  :color="color"
                  class="v-settings__item mr-2 cursor-pointer"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>
        </div>
        <!---End Sidebar Color -->
        <v-divider></v-divider>
        <!---Sidebar Color -->
        <div class="px-4 py-4">
          <span>Sidebar Colors</span>
          <v-item-group v-model="setSidebarColor">
            <v-item
              v-for="color in SidebarColors"
              :key="color"
              :value="color"
              class="mt-2"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-sidebar_active'"
                  :color="color"
                  class="v-settings__item mr-2 cursor-pointer"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>
        </div>
        <!---End Sidebar Color -->
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import Proxyable from "vuetify/lib/mixins/proxyable";
export default {
  name: "Customizer",
  mixins: [Proxyable],
  data: () => ({
    right: false,
    SidebarColor: "",
    SidebarColors: [
      "white",
      "#1E1E1E",
      "#1856e6",
      "#1a9bfc",
      "#1e88e5",
      "rgb(77, 86, 100)",
    ],
    navbarColor: "#fafafa",
    navbarColors: [
      "#fb9778",
      "#1856e6",
      "#6018e6",
      "#fc4b6c",
      "#fafafa",
      "#00c292",
    ],
  }),
  computed: {
    Customizer_drawer: {
      get() {
        return this.$store.state.Customizer_drawer;
      },
      set(val) {
        this.$store.commit("SET_CUSTOMIZER_DRAWER", val);
      },
    },
    setSidebarColor: {
      get() {
        return this.$store.state.SidebarColor;
      },
      set(val) {
        this.$store.commit("SET_SIDEBAR_COLOR", val);
      },
    },
    setNavbarColor: {
      get() {
        return this.$store.state.navbarColor;
      },
      set(val) {
        this.$store.commit("SET_NAVBAR_COLOR", val);
      },
    },
    setHorizontalLayout: {
      get() {
        return this.$store.state.setHorizontalLayout;
      },
      set(val) {
        this.$store.commit("SET_LAYOUT", val);
      },
    },
  },
  watch: {
    themecolor(val) {
      (this.$vuetify.theme.themes[this.isDark ? "dark" : "light"].primary =
        val),
        (this.$vuetify.theme.themes[this.isLight ? "light" : "dark"].primary =
          val);
    },
    setSidebarColor(val) {
      this.$store.commit("SET_SIDEBAR_COLOR", val);
    },
    setNavbarColor(val) {
      this.$store.commit("SET_NAVBAR_COLOR", val);
    },
    setHorizontalLayout(val) {
      this.$store.commit("SET_LAYOUT", val);
    },
  },
  methods: {},
};
</script>

<style lang="scss">
.v-application .v-item-group .v-sidebar_active {
  border: 1px solid black !important;
}
</style>
