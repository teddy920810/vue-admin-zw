<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="config" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item label="APP特别声明" prop="statement">
        <el-input v-model="config.statement" :rows="12" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" style="margin-left: 380px">
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getList, saveData } from '@/api/config'

export default {
  data() {
    return {
      config: {
        id: undefined,
        statement: ''
      },
      rules: {
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getList(this.listQuery).then(response => {
        if (response.data.list.length > 0) {
          this.config = response.data.list[0]
        }
      })
    },
    saveData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          saveData(this.config).then(() => {
            this.getData()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
