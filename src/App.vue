<template>
  <div id="app">
    <RepoCard 
      username="bryceremick"
      repoName="vuehub"
    />
  </div>
</template>

<script>
import RepoCard from './components/RepoCard.vue'

export default {
  name: 'app',
  components: {
    RepoCard
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap');

#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;
  justify-content: center;
  align-items: center;
}
html,body, #app{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
body{
  background-color: #50E3C2;
}
</style>
