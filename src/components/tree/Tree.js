class Tree {
  /**
   * @param {Object} resData 从接口或缓存拿到的数据
   * @param {Boolean} isSingleChecked 是否单选 true-单选 false-多选
   * @param {Array} historyChecked 初始化时需要选中的ids(历史ids)
   * @param {Array} disabledChecked 初始化时不允许选中的ids
   * @param {Boolean} isRelate 是否多选联动
   */
  constructor(resData = [], isSingleChecked = false, historyChecked = [], disabledChecked = [], isRelate = true) {
    this.resData = [...resData]
    this.treeMap = null // 父-子id映射
    this.tree = null // 构造完整的树结构数据
    this.currentChecked = false // 当前点击选中状态，减少子节点递归次数
    this.isSingleChecked = isSingleChecked
    this.isRelate = isRelate
    this.disabledChecked = disabledChecked
    this.checkedList = historyChecked[0] === 'all' ? [] : [...historyChecked] // 选中目录id的数组
    this.checkedNameList = [] // 选中的目录名称数组
    this.checkedAll = historyChecked[0] === 'all' // 是否全选,只在初始加载时用到
    this.totalCount = 0 // 目录总数
    this.solveToTree(resData)
  }

  /**
   * 一维数据构造树结构
   * @param {Array} resData 从接口获取到的源数据
   */
  solveToTree(resData) {
    this.resData = [...resData]
    this.totalCount = 0
    // 构建父-子映射
    this.treeMap = resData.reduce((acc, cur) => {
      cur.name = cur.name.trim()
      cur.children = []
      if (this.checkedAll) { // 如果全选，就填充选中的ids数组
        cur.checked = true
        this.checkedList.push(cur.id)
      } else { 
        // 否则根据初始化实例对象时的默认选中项设置checked是否选中
        cur.checked = this.checkedList.includes(cur.id)
      }
      cur.disabled = this.disabledChecked.includes(cur.id)
      acc[cur.id] = cur
      this.totalCount ++
      return acc
    }, {})
    // 初始化选中的目录名称列表，不直接在上面循环中构造，是为了控制与checkList索引一致
    this.checkedNameList = this.checkedList.reduce((acc, id) => {
      return acc.concat(this.treeMap[id]?.name)
    }, [])
    // 构建树目录
    this.tree = resData.filter(item => {
      this.treeMap[item.pId] && this.treeMap[item.pId].children.push(item)
      return !this.treeMap[item.pId]
    })
  }

  /**
   * 加载子节点的数据
   */
  lazyLoadNodeData(node, list) {
    const deleteIds = this.getChildIds(node.children).map(ele => ele.id)
    this.resData = this.resData.filter(ele => !deleteIds.includes(ele.id))
    const newList = list.map(ele => ({ ...ele, pId: node.id })).filter(ele => ele.id !== ele.pId)
    console.log(99999998877, list, newList)
    this.resData.push(...newList)
    this.solveToTree(this.resData)
  }

  /**
 * 获取指定节点的所有子孙节点
 * @param {Array} childNodes 子节点数组
 * @returns {Array} 所有子孙节点
 */
  getChildIds(childNodes) {
    // 如果没有子节点，则返回空数组
    if (childNodes.length === 0) {
      return [];
    }
    // 递归地获取每个子节点的子孙节点，并将它们拼接到当前数组中
    return childNodes.concat(
      childNodes.map(node => this.getChildIds(node.children)).flat()
    )
  }

  /**
   * 更新选中的checkedList
   * @param {Array} checkedList 
   */
  refreshCheckedList(checkedList) {
    checkedList.forEach(id => {
      let item = this.treeMap[id]
      if (item) item.checked = true
      this.currentChecked = true
      this.setCheckedList(id)
    })
  }

  /**
   * 树节点的选择
   */
  selectNode(id) {
    let item = this.treeMap[id]
    if (!item || item.disabled) return;
    item.checked = !item.checked
    this.currentChecked = item.checked
    if (this.isSingleChecked) {
      // 如果是单选，将上一次设置的值置为false
      const checkPrev = this.checkedList.shift()
      this.checkedNameList.shift()
      if (checkPrev) {
        this.treeMap[checkPrev].checked = false
      }
      this.setCheckedList(item.id)
      return
    }
    this.setCheckedList(item.id)
    if (this.isRelate) {
      this.checkChilds(item.children, item.checked)
      this.checkParents(item.pId)
    }
  }

  /**
   * 子节点checked状态的改变
   * @param {Array} childItems 需要操作的子节点
   * @param {Boolean} checked 是否选中
   */
  checkChilds(childItems, checked) {
    if (childItems.length) {
      childItems.forEach(item => {
        // 如果子节点已经是当前的选中态，跳出，减少递归次数
        if (item.checked === this.currentChecked) return

        item.checked = checked
        this.setCheckedList(item.id)
        this.checkChilds(item.children, checked)
      })
    }
  }

  /**
   * 父节点checked状态的改变
   * @param {String} pId 父id
   * @param {Object} treeMap 父-子id映射对象
   */
  checkParents(pId) {
    if (this.treeMap[pId] && this.treeMap[pId].children.length) {
      const parentChecked = this.treeMap[pId].children.every(item => item.checked)
      if (this.treeMap[pId].checked === parentChecked) return // 如果父节点与需要选中的状态一致，则退出循环，不需要再往上冒泡递归
      this.treeMap[pId].checked = parentChecked
      this.setCheckedList(this.treeMap[pId].id)
      this.treeMap[pId].pId && this.checkParents(this.treeMap[pId].pId)
    }
  }

  /**
   * 设置选中ids
   * @param {String} id 正在设置checked属性的节点id
   */
  setCheckedList(id) {
    const checkedIndex = this.checkedList.findIndex(item => item === id)
    if (this.currentChecked && checkedIndex === -1) {
      // 如果当前态选中，且节点id不在选中数组中就填充
      this.checkedList.push(id)
      this.checkedNameList.push(this.treeMap[id]?.name)
    } else if (!this.currentChecked && checkedIndex > -1) {
      // 如果当前态未选中，且节点id在选中数组中就删除
      this.checkedList.splice(checkedIndex, 1)

      // this.checkedNameList.findIndex(name => name === this.treeMap[id].name) 不用此方法是防止重名导致删除出错
      // 控制名称插入与id插入一致，即可直接根据共同索引来删除
      this.checkedNameList.splice(checkedIndex, 1)
    }
  }
}

export { Tree }