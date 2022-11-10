<template>
  <v-container class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="6" sm="8" xl="4">
        <transition appear name="fadeout">
          <v-layout column align-center justify-center class="mb-5">
            <v-alert outlined type="success" class="mt-4 mb-4" :value="true">
              <div class="title mt-2 mb-2">{{ $t('changed.update-pwd') }}</div>
            </v-alert>
            <transition appear name="fadeout">
              <v-btn color="amber accent-3" dark large class="mb-5" @click="navSignIn()">{{ $t('login.login') }}</v-btn>
            </transition>
          </v-layout>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router/router'
export default {
  name: "changed",
  methods: {
    navSignIn: function () {
      console.log('navigating to sign in')
      router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>