<template>
  <div id="app">
    <treeLevel />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import treeLevel from './components/tree/tree-level'

export default {
  name: 'App',
  components: {
    treeLevel
  },
  data () {
    return {
      treeData: [{ id: 1, label: '子节点' }]
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
