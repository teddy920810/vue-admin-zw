<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="config" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item label="关注政务号" prop="focused">
        <el-input v-model="config.focused"/>
      </el-form-item>
      <el-form-item label="回答问题" prop="answer">
        <el-input v-model="config.answer"/>
      </el-form-item>
      <el-form-item label="发布内容" prop="publish">
        <el-input v-model="config.publish"/>
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
        focused: '',
        answer: '',
        publish: ''
      },
      rules: {
        focused: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[\d]*$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        answer: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[\d]*$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        publish: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[\d]*$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getList(this.listQuery).then(response => {
        this.config = response.data.list[0]
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
