<template>
  <el-tree
    ref="per"
    :data="permissionData"
    :default-checked-keys="defaultCheckKeys"
    :props="defaultProps"
    show-checkbox
    node-key="id"
    @check="checkVal"/>
</template>

<script>
import { getPermission } from '@/api/permission'

export default {
  props: {
    defaultCheckOption: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      permissionData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      defaultCheckKeys: this.defaultCheckOption
    }
  },
  watch: {
    defaultCheckOption(val) {
      this.defaultCheckKeys = val
      this.$refs.per.setCheckedKeys(this.defaultCheckKeys)
    }
  },
  created() {
    this.getPermissionJson()
  },
  methods: {
    getPermissionJson() {
      getPermission().then(response => {
        this.permissionData = response.data
      })
    },
    checkVal(data) {
      this.$emit('checkPermission', this.$refs.per.getCheckedKeys())
    }
  }
}
</script>
