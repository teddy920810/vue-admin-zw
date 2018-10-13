<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
    问政组件管理平台
    <el-dialog :visible.sync="dialogFormVisible" title="完善政务号信息">
      <el-form ref="dataForm" :rules="rules" :model="government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="office_name">
          <el-input v-model="government.office_name"/>
        </el-form-item>
        <el-form-item label="描述" prop="office_desc">
          <el-input v-model="government.office_desc"/>
        </el-form-item>
        <el-form-item label="所属地区" prop="office_city_id">
          <region :select-option="[government.office_province_id,government.office_city_id]" @selectRegion="selectRegion"/>
        </el-form-item>
        <el-form-item label="政务指数" prop="office_index">
          <el-input v-model="government.office_index"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bindGovernment } from '@/api/government'
import Region from '../region/index.vue'

export default {
  name: 'Dashboard',
  components: { Region },
  data() {
    return {
      dialogFormVisible: false,
      government: {
        user_id: undefined,
        office_name: '',
        office_desc: '',
        office_index: '',
        office_province_id: '',
        office_city_id: ''
      },
      rules: {
        office_name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        office_desc: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        office_city_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        office_index: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[\d]*$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.dialogFormVisible = Object.is('', this.name)
  },
  methods: {
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          bindGovernment(this.government).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    selectRegion(data) {
      this.government.office_province_id = data[0]
      this.government.office_city_id = data[1]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
