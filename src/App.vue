<template>
  <generalView/>
</template>

<script>

  import generalView from './components/generalView/index';

export default {
  name: 'app',
  components: {
    generalView
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>