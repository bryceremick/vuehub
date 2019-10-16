<template>
  <div id="app">
    <ListRepos 
      username="bryceremick"
      sort_by="stargazers_count"
    />
  </div>
</template>

<script>
import ListRepos from './components/ListRepos.vue'

export default {
  name: 'app',
  components: {
    ListRepos
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
