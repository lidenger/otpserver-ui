<template>
  <main>
    <Header/>
    <RouterView/>
  </main>
</template>


<script setup lang="ts">
import {RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<style>
main {
  margin: 0;
  padding: 0;
  background-color: #fff;
}

.box-card {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 20px;
  margin: 70px auto 0;
  max-width: 1400px;
  min-height: 700px;
}
</style>
