<template>
  <el-tree
    ref="per"
    :data="permissionData"
    :default-expanded-keys="defaultCheckKeys"
    :default-checked-keys="defaultCheckKeys"
    :props="defaultProps"
    :check-strictly="true"
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
        label: 'name'
      },
      defaultCheckKeys: this.defaultCheckOption
    }
  },
  watch: {
    defaultCheckOption(val) {
      this.defaultCheckKeys = val
    }
  },
  created() {
    this.getPermissionJson()
    console.log(this.permissionData)
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
