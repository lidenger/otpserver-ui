<template>
  <h1>login</h1>
</template>


<script setup>
import {onBeforeMount} from "vue";

onBeforeMount(() => {
  this.$emit('fatherMethod');
})
</script>


<style scoped>

</style>