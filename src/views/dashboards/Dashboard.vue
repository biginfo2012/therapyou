<template>
  <v-container fluid class="down-top-padding">
    <BaseBreadcrumb
      :title="page.title"
      :icon="page.icon"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <v-row>
      <v-col cols="12" sm="12" lg="6">

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Analytical",

  data: () => ({
    page: {
      title: "Analytical",
    },
    breadcrumbs: [
      {
        text: "Dashboard",
        disabled: false,
        to: "#",
      }
    ],
  }),
  components: {

  },
};
</script>