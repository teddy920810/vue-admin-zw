<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="config" label-position="left" label-width="140px" style="width: 700px; margin-left:50px;">
      <h4>政务号指数设置</h4><hr>
      <el-form-item label="政务号指数名称">
        <el-input v-model="config.office_index_name"/>
        若不设置，默认显示为 “政务指数”
      </el-form-item>
      <el-form-item label="关注政务号，增加" prop="focused">
        <el-input v-model="config.focused">
          <template slot="suffix">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="回答问题，增加" prop="answer">
        <el-input v-model="config.answer">
          <template slot="suffix">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="发布内容，增加" prop="publish">
        <el-input v-model="config.publish">
          <template slot="suffix">分</template>
        </el-input>
      </el-form-item>
      <h4>APP设置</h4><hr>
      <el-form-item label="APP名称" prop="app_name">
        <el-input v-model="config.app_name"/>
      </el-form-item>
      <el-form-item label="APP底部提示" required>
        <el-col :span="12">
          <el-form-item prop="email">
            <el-input v-model="config.email">
              <template slot="prepend">发送邮件到</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="group">
            <el-input v-model="config.group">
              <template slot="prepend">申请加入</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="APP底部特别声明">
        <el-input v-model="config.sys_desp" :rows="7" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" style="margin-left: 580px">
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
        publish: '',
        office_index_name: '',
        sys_desp: '',
        email: '',
        group: '',
        app_name: ''
      },
      rules: {
        focused: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        answer: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        publish: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        email: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        app_name: [
          { required: true, message: '请输入', trigger: 'blur' }
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
<style>
  .el-input__suffix{
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    right: -23px;
  }
  .el-input-group__prepend{
    background-color: transparent;
    border: none;
  }
</style>
