<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="搜索政务号名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="hasButton('PP_OFFICE_ADD')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="政务号">
        <template slot-scope="scope">
          <img v-if="scope.row.head_pic" :src="GLOBAL.fileBaseUrl + scope.row.head_pic" width="50" height="50">
          <img v-else src="@/assets/img/webwxgetmsgimg.png" width="50" height="50"><br>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column label="政务指数">
        <template slot-scope="scope">
          {{ scope.row.index }}
        </template>
      </el-table-column>
      <el-table-column label="政务号描述">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="hasButton('PP_OFFICE_EDIT')" type="primary" size="mini" @click="handleEditGovernment(scope.row)">编辑</el-button>
          <el-button v-if="hasButton('PP_OFFICE_ROLE') && scope.row.name" type="info" size="mini" @click="handleRoleGovernment(scope.row)">角色配置</el-button>
          <el-button v-if="hasButton('PP_OFFICE_DEL')" type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="新增/编辑政务号">
      <el-form ref="dataForm" :rules="rules" :model="government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="选择用户" prop="user_name">
          <el-input v-model="government.user_name" disabled style="width: 60%"/>
          <el-popover
            v-model="userListVisible"
            placement="right"
            width="300"
            trigger="manual">
            <div class="filter-container">
              <el-input v-model="userListQuery.user_name" placeholder="账号" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilterUser"/>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterUser"/>
            </div>
            <el-table
              :data="userList"
              highlight-current-row
              @row-click="handleUserSelectChange">
              <el-table-column width="150" property="user_id" label="用户ID"/>
              <el-table-column width="150" property="user_name" label="用户账户"/>
            </el-table>
            <el-pagination
              :current-page="userListQuery.page"
              :page-size="userListQuery.page_size"
              :total="userTotal"
              small
              layout="prev, pager, next"
              @size-change="handleSizeChangeUser"
              @current-change="handleCurrentChangeUser"/>
            <el-button v-show="dialogFormCreate" slot="reference" @click="userListVisible = true">选择用户</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="government.name"/>
        </el-form-item>
        <el-form-item label="头像" prop="head_pic">
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
        <el-form-item label="描述" prop="desc">
          <el-input v-model="government.desc"/>
        </el-form-item>
        <el-form-item label="所属地区" prop="city_id">
          <region :select-option="[government.province_id,government.city_id]" @selectRegion="selectRegion"/>
        </el-form-item>
        <el-form-item label="政务指数" prop="index">
          <el-input v-model="government.index"/>
        </el-form-item>
        <el-form-item label="banner图片" prop="banner_pic">
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
        <el-button @click="dialogFormVisible = false; userListVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
    <!-- 角色配置 -->
    <el-dialog :visible.sync="dialogRoleFormVisible" title="角色配置">
      <el-form ref="dataRoleForm" :model="role_government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称">
          <el-input v-model="role_government.name" :disabled="true"/>
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
import { getGovernmentList, editGovernment, addGovernment, deleteGovernment, getSysUserList } from '@/api/government'
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
        name: null
      },
      userList: null,
      userTotal: 0,
      userListQuery: {
        page: 1,
        page_size: 5,
        user_name: null
      },
      government: {
        user_id: undefined,
        user_name: '',
        name: '',
        desc: '',
        index: '',
        province_id: '',
        city_id: '',
        banner_pic: '',
        head_pic: ''
      },
      role_government: {
        user_id: undefined,
        name: '',
        role_ids: []
      },
      dialogFormVisible: false,
      dialogFormCreate: false,
      dialogRoleFormVisible: false,
      rules: {
        user_name: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        city_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        index: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator(r, v, b) { (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        banner_pic: [
          { required: true, message: '请上传', trigger: 'blur' }
        ],
        head_pic: [
          { required: true, message: '请上传', trigger: 'blur' }
        ]
      },
      userListVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGovernmentList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getUserList() {
      getSysUserList(this.userListQuery).then(response => {
        this.userList = response.data.list
        this.userTotal = response.data.total
      })
    },
    resetGovernment() {
      this.government = {
        user_id: undefined,
        user_name: '',
        name: '',
        desc: '',
        index: '',
        province_id: '',
        city_id: '',
        banner_pic: '',
        head_pic: ''
      }
    },
    handleCreate() {
      this.getUserList()
      this.resetGovernment()
      this.dialogFormCreate = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEditGovernment(row) {
      this.getUserList()
      this.government = Object.assign({}, row)
      this.dialogFormCreate = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetRoleGovernment() {
      this.role_government = {
        user_id: undefined,
        name: '',
        role_ids: []
      }
    },
    handleRoleGovernment(row) {
      this.resetRoleGovernment()
      this.role_government.user_id = row.user_id
      this.role_government.name = row.name
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
          if (this.government.id) {
            editGovernment(this.government).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.userListVisible = false
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addGovernment(this.government).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.userListVisible = false
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },
    saveRoleData() {
      this.$refs['dataRoleForm'].validate((valid) => {
        if (valid) {
          delete this.role_government.name
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
    handleFilterUser() {
      this.userListQuery.page = 1
      this.getUserList()
    },
    handleSizeChangeUser(val) {
      this.userListQuery.page_size = val
      this.getUserList()
    },
    handleCurrentChangeUser(val) {
      this.userListQuery.page = val
      this.getUserList()
    },
    selectRegion(data) {
      this.government.province_id = data[0]
      this.government.city_id = data[1]
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
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    handleBannerSuccess(res, file) {
      this.government.banner_pic = res.data
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    deleteData(row) {
      this.$confirm('此操作将永久删除该政务号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteData = { id: row.id }
        deleteGovernment(deleteData).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUserSelectChange(val) {
      this.government.user_id = val.user_id
      this.government.user_name = val.user_name
      this.userListVisible = false
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
