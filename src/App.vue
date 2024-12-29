
<template>
  <div id="app">
    <AppHeader />
    <router-view />

  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader,

  }
};
</script>
<style>
*{
  margin: 0;
  padding: 0;
}
</style>