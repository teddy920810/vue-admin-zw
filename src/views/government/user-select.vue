<template>
  <el-select ref="select" v-model="value" placeholder="请选择用户" @change="change">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.username"
      :value="item.id"/>
  </el-select>
</template>

<script>
import { getUserAll } from '@/api/goverment'
export default {
  props: {
    defaultValue: {
      type: String,
      default: () => { return '' }
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
    }
  },
  created() {
    this.getUserJson()
  },
  methods: {
    getUserJson() {
      getUserAll().then(response => {
        this.options = response.data
      })
    },
    change(data) {
      this.$emit('change', data)
    }
  }
}
</script>
