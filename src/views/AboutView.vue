<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>


<script setup>
import axios from "@/config/axios.config.js";

const health = () => {
  axios.get("/health")
      .then(resp => {
        console.log(resp.data)
      })
      .catch(err => {
        console.log(err)
      })
}

health()

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>


