<script setup lang="ts">
import { ref } from "vue";
import BaseBreadcrumb from "@/components/BaseBreadcrumb.vue";

const page = ref({ title: "Dashboard" });
const breadcrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    to: "#",
  },
]);
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" sm="12" lg="6">
      <v-card>
        <img
            src="@/assets/images/background/welcome-bg2-2x-svg.svg"
            class="bg-img-1"
        />
        <v-card-text>
          <h3 class="h3 title overlay-title font-weight-medium mb-1">
            Hey John, <br />Download latest report
          </h3>
          <v-btn color="secondary" class="mt-4"> Download </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
