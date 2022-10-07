<template>
  <section>
    <v-layout column align-center justify-center class="mb-5">
      <v-alert outline type="success" class="mb-4" :value="true">
        <div class="title mb-2">You have successfully registered.</div>
      </v-alert>
      <transition appear name="fadeout">
        <v-btn color="amber accent-3" dark large class="mb-5" @click="navSignIn()">Sign In</v-btn>
      </transition>
    </v-layout>
  </section>
</template>

<script>
import router from '../../router'
export default {
  name: "registered",
  methods: {
    navSignIn: function () {
      router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>