<template>
  <v-app
    id="flexy"
    :class="`${
      !$vuetify.breakpoint.smAndDown ? 'full-sidebar' : 'mini-sidebar'
    }`"
  >
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},
};
</script>
