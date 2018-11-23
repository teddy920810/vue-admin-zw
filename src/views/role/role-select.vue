<template>
  <el-select ref="select" v-model="value" multiple placeholder="请选择角色" @change="change">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"/>
  </el-select>
</template>

<script>
import { getRoleAll } from '@/api/role'
export default {
  props: {
    defaultValue: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      options: [],
      value: this.defaultValue
    }
  },
  watch: {
    defaultValue(val) {
      this.value = val
      console.log(this.$refs.select)
    }
  },
  created() {
    this.getRoleJson()
  },
  methods: {
    getRoleJson() {
      getRoleAll().then(response => {
        this.options = response.data
      })
    },
    change(data) {
      this.$emit('change', data)
    }
  }
}
</script>
