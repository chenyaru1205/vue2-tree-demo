<template>
  <div class="tree-level-box-item">
    <div class="tree-level-box">
      <div v-for="node in list" :key="node.id">
        <el-checkbox :checked="node.checked" @change="checkNode(node)"></el-checkbox>
        <span @click="toggleNode(node, level)"> {{ node.name }} </span>
      </div>
    </div>
    <TreeBox
      v-if="childList.length"
      :updateKey="updateKey"
      :level="level + 1" 
      :list="childList"
      :openIds="openIds"
      :onSelectNode="onSelectNode"
      :onToggleNode="onToggleNode"
    />
  </div>
</template>

<script>
export default {
  name: 'TreeBox',
  props: {
    level: {
      type: Number,
      default: () => 0
    },
    list: {
      type: Array,
      default: () => []
    },
    openIds: {
      type: Array,
      default: () => {}
    },
    onSelectNode: {
      type: Function
    },
    onToggleNode: {
      type: Function
    }
  },
  computed: {
    childList() {
      return Array.isArray(this.list) && this.list.find(ele => ele.id === this.openId)?.children || []
    },
    openId() {
      return this.openIds?.[this.level]
    }
  },
  data () {
    return {
      updateKey: 0,
    }
  },
  watch: {
    list: {
      handler() {
        this.updateKey ++
      },
      deep: true
    }
  },
  methods: {
    checkNode(node) {
      this.onSelectNode(node)
      console.log(9999999999741)
      // this.updateView = !this.updateView

    },
    toggleNode(node, depth) {
      this.onToggleNode(node, depth)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-level-box-item {
  display: flex;
  .tree-level-box {
    text-align: start;
    padding: 10px;
    margin: 0 10px;
    overflow-y: auto;
    width: 200px;
    height: 300px;
    border: 1px solid #000;
  }
}
</style>
