<template>
  <div class="tree-level-container">
    <tree-box
      :key="updateKey"
      :level="0" 
      :list="treeList"
      :openIds="openIds"
      :onSelectNode="onSelectNode"
      :onToggleNode="onToggleNode"
    />
  </div>
</template>

<script>
import { Tree } from './Tree'
import treeBox from './tree-box.vue'
export default {
  name: 'TreeLevel',
  components: {
    treeBox
  },
  porps: {
    
  },
  data () {
    return {
      updateKey: 0,
      openIds: [1],
      treeInstance: null,
      treeList: [],
      list: [
        {id: 1, name: 'ceshi1', pId: 0},
        {id: 2, name: 'ceshi2', pId: 0, checked: false},
        {id: 3, name: 'ceshi3', pId: 1},
        {id: 4, name: 'ceshi4', pId: 1},
        {id: 5, name: 'ceshi5', pId: 3},
        {id: 6, name: 'ceshi6', pId: 3},
        {id: 7, name: 'ceshi7', pId: 5},
        {id: 8, name: 'ceshi8', pId: 7},
        {id: 9, name: 'ceshi9', pId: 8},
        {id: 10, name: 'ceshi10', pId: 9},
        {id: 11, name: 'ceshi11', pId: 10},
        {id: 12, name: 'ceshi12', pId: 11},
        {id: 13, name: 'ceshi13', pId: 12},
        {id: 14, name: 'ceshi14', pId: 13},
        {id: 15, name: 'ceshi15', pId: 14},
        {id: 16, name: 'ceshi16', pId: 15},
        {id: 17, name: 'ceshi17', pId: 2},
        {id: 18, name: 'ceshi18', pId: 2},
        {id: 19, name: 'ceshi19', pId: 2},
        {id: 100, name: 'ceshi100', pId: 101}
      ]
    }
  },
  created() {
    // 创建树的实例
    this.treeInstance = new Tree()
    this.treeList = this.treeInstance.tree
    // 初始化树的数据
    this.refreshTreeData(this.list)
    console.log(9999999, this.treeList, this.treeInstance)
  },
  mounted() {
    // 延迟5秒，选中数据，模拟接口请求赋值回填的
    setTimeout(() => {
      this.treeInstance.refreshCheckedList([2, 4, 18, 19, 177])
      this.updateKey ++
    }, 5000)
  },
  methods: {
    // 节点懒加载数据
    lazyLoadTreeData(node) {
      // 假设该数据是接口请求的
      const childNodeData = [
        {id: 177, name: 'ceshi177', pId: 100},
        {id: 187, name: 'ceshi187', pId: 100},
        {id: 197, name: 'ceshi197', pId: 100}
      ]
      this.treeInstance.lazyLoadNodeData(node, childNodeData)
      this.treeList = this.treeInstance.tree
    },
    refreshTreeData(list) {
      this.treeInstance.solveToTree(list)
      this.treeList = this.treeInstance.tree
    },
    // 选中触发的事件
    onSelectNode(node) {
      this.treeInstance.selectNode(node.id)
      // 获取已选中的数据，可通过this.treeInstance进入拿checkedList属性，所有选中节点的id，包含父子节点
    },
    // 点击下拉展开数据
    onToggleNode(node, level) {
      this.$set(this.openIds, level, node.id)
      this.openIds.forEach((ele, i) => {
        if (i > level) this.openIds[i] = undefined
      });
      // 当点击id是100的数据，懒加载子节点数据
      if (node.id === 100) {
        this.lazyLoadTreeData(node)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-level-container {
  width: 100%;
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
