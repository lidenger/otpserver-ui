<template>
  <main>
    <Header v-if="isShowHeader"/>
    <RouterView ref="routerView" @headerShowMethod="headerShow"/>
  </main>
</template>


<script setup>
import {RouterView} from 'vue-router'
import Header from './components/Header.vue'
import {ref} from "vue";

let isShowHeader = ref(true)

const headerShow = (show) => {
  isShowHeader.value = show
}

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
