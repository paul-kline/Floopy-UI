<template>
  <v-layout column justify-center align-center>
    <FloopyComponent />
  </v-layout>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
import FloopyComponent from "~/components/FloopyComponent.vue";
export default {
  components: {
    Logo,
    VuetifyLogo,
    FloopyComponent
  }
};
</script>
