<template>
  <v-app id="inspire" :class="{ horizontalstyle: setHorizontalLayout }">
    <v-main :class="{ miniSide: expandOnHover }">
      <v-container class="page-wrapper">
        <!-- ---------------------------------- -->
        <!--- Vertical Header part -->
        <!-- ---------------------------------- -->
        <VerticalHeader
            v-if="!setHorizontalLayout"
            v-model="expandOnHover"
        ></VerticalHeader>
        <router-view/>
      </v-container>
    </v-main>
    <!-- ---------------------------------- -->
    <!--- Vertical Sidebar  part -->
    <!-- ---------------------------------- -->
    <VerticalSidebar
        v-if="!setHorizontalLayout"
        :expand-on-hover.sync="expandOnHover"
    ></VerticalSidebar>
    <!-- ---------------------------------- -->    <Footer v-if="!setHorizontalLayout"></Footer>
  </v-app>
</template>

<script>

import VerticalHeader from "./vertical-header/VerticalHeader"
import VerticalSidebar from "./vertical-sidebar/VerticalSidebar"
import Footer from "./footer/Footer"
import {mapState, mapMutations} from "vuex"

export default {
  name: "Layout",

  components: {
    VerticalHeader,
    VerticalSidebar,
    Footer
  },

  props: {
    source: String,
  },
  data: () => ({
    expandOnHover: false,
  }),
  computed: {
    ...mapState(["Customizer_drawer", "setHorizontalLayout"]),
  },

  methods: {
    ...mapMutations({
      setCustomizerDrawer: "SET_CUSTOMIZER_DRAWER",
    }),
  },
}
</script>

<style></style>
