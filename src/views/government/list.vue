<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.office_name" placeholder="搜索名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <!--<region :select-option="selectOption" class="filter-item" @selectRegion="searchRegion"/>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.head_pic" :src="GLOBAL.fileBaseUrl + scope.row.head_pic" width="50" height="50">
          <img v-else src="@/assets/img/webwxgetmsgimg.png" width="50" height="50"><br>
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名">
        <template slot-scope="scope">
          {{ scope.row.real_name }}
        </template>
      </el-table-column>
      <el-table-column label="政务号名称">
        <template slot-scope="scope">
          {{ scope.row.office_name }}
        </template>
      </el-table-column>
      <el-table-column label="政务指数">
        <template slot-scope="scope">
          {{ scope.row.office_index }}
        </template>
      </el-table-column>
      <el-table-column label="政务号描述">
        <template slot-scope="scope">
          {{ scope.row.office_desc }}
        </template>
      </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope">
          {{ scope.row.office_province }}{{ scope.row.office_city }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template slot-scope="scope">
          <el-button v-if="hasButton('PP_OFFICE_EDIT')" type="primary" size="mini" icon="el-icon-edit" @click="handleBindGovernment(scope.row)">编辑</el-button>
          <el-button v-if="hasButton('PP_OFFICE_ROLE') && scope.row.office_name" type="info" size="mini" @click="handleRoleGovernment(scope.row)">角色配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <!-- 新增/修改政务号 -->
    <el-dialog :visible.sync="dialogFormVisible" title="绑定政务号">
      <el-form ref="dataForm" :rules="rules" :model="government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="office_name">
          <el-input v-model="government.office_name"/>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeHeadUpload"
            :on-success="handleHeadSuccess"
            :action="GLOBAL.uploadFileUrl"
            :headers="myHeader"
            class="avatar-uploader">
            <img v-if="government.head_pic" :src="GLOBAL.fileBaseUrl+government.head_pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          图片建议尺寸：100*100
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
        <el-form-item label="banner图片">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeBannerUpload"
            :on-success="handleBannerSuccess"
            :action="GLOBAL.uploadFileUrl"
            :headers="myHeader"
            class="banner-uploader">
            <img v-if="government.banner_pic" :src="GLOBAL.fileBaseUrl+government.banner_pic" class="banner">
            <i v-else class="el-icon-plus banner-uploader-icon"/>
          </el-upload>
          图片建议尺寸：240*120
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
    <!-- 角色配置 -->
    <el-dialog :visible.sync="dialogRoleFormVisible" title="角色配置">
      <el-form ref="dataRoleForm" :model="role_government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称">
          <el-input v-model="role_government.office_name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="角色">
          <role-select :default-value="role_government.role_ids" @change="changeOpinion"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSysUserList, bindGovernment } from '@/api/government'
import { editUserRole, getUserRoleInfoByUserId } from '@/api/role'
import { getToken } from '@/utils/auth'
import Region from '../region/index.vue'
import RoleSelect from '../role/role-select.vue'

const token = getToken()
export default {
  components: { Region, RoleSelect },
  data() {
    return {
      myHeader: { 'token': token },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        office_name: null
      },
      government: {
        user_id: undefined,
        office_name: '',
        office_desc: '',
        office_index: '',
        office_province_id: '',
        office_city_id: '',
        banner_pic: '',
        head_pic: ''
      },
      role_government: {
        user_id: undefined,
        office_name: '',
        role_ids: []
      },
      dialogFormVisible: false,
      dialogRoleFormVisible: false,
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
          { validator(r, v, b) { (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSysUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleBindGovernment(row) {
      this.government = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetRoleGovernment() {
      this.role_government = {
        user_id: undefined,
        office_name: '',
        role_ids: []
      }
    },
    handleRoleGovernment(row) {
      this.resetRoleGovernment()
      this.role_government.user_id = row.user_id
      this.role_government.office_name = row.office_name
      getUserRoleInfoByUserId(this.role_government.user_id).then((res) => {
        res.data.forEach((role) => {
          this.role_government.role_ids.push(role.id)
        })
        this.dialogRoleFormVisible = true
      })
    },
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
    saveRoleData() {
      this.$refs['dataRoleForm'].validate((valid) => {
        if (valid) {
          delete this.role_government.office_name
          editUserRole(this.role_government).then(() => {
            this.getList()
            this.dialogRoleFormVisible = false
            this.$notify({
              title: '成功',
              message: '角色配置成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    selectRegion(data) {
      this.government.office_province_id = data[0]
      this.government.office_city_id = data[1]
    },
    searchRegion(data) {
      this.listQuery.province_id = data[0]
      this.listQuery.city_id = data[1]
    },
    changeOpinion(val) {
      this.role_government.role_ids = val
    },
    beforeBannerUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    beforeHeadUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleHeadSuccess(res, file) {
      this.government.head_pic = res.data
      console.log('head upload')
      console.log(this.government.head_pic)
    },
    handleBannerSuccess(res, file) {
      this.government.banner_pic = res.data
      console.log('banner upload')
      console.log(this.government.banner_pic)
    }
  }
}
</script>
<style>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  .banner-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 240px;
    height: 120px;
  }
  .banner-uploader:hover {
    border-color: #409EFF;
  }
  .banner-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .banner {
    width: 240px;
    height: 120px;
    display: block;
  }
</style>
