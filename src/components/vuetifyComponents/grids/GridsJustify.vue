<script setup lang="ts">
import { ref } from "vue";

const justify = ref(['start',
        'center',
        'end',
        'space-around',
        'space-between',]);
</script>

<template>
  <!-- ----------------------------------------------------------------------------- -->
  <!-- Justify  -->
  <!-- ----------------------------------------------------------------------------- -->
  <v-container class="bg-grey-lighten-5">
    <v-row
      v-for="j in justify"
      :key="j"
      :justify="j"
    >
      <v-col
        v-for="k in 2"
        :key="k"
        md="4"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          One of two columns
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
