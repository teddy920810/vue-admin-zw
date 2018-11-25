<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="搜索名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="hasButton('ROLE_ADD')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="hasButton('ROLE_EDIT')" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="hasButton('ROLE_DEL')" type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
          <el-button v-if="hasButton('ROLE_EDIT')" type="info" size="mini" @click="handlerPermission(scope.row)">模块配置</el-button>
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
    <!-- 新增/修改角色 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="role" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
    <!-- 给角色赋权 -->
    <el-dialog :visible.sync="dialogPermissionVisible" title="角色赋权" >
      <el-form ref="dataFormPermission" :model="role_permission" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称">
          <el-input v-model="role_permission.role_name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="角色权限">
          <permission :default-check-option="role_permission.permission_ids" @checkPermission="hasCheckOpinion" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, addRole, editRole, deleteRole } from '@/api/role'
import { getPermissionByRole, editRolePermission } from '@/api/permission'

import Permission from '../role/permission.vue'

export default {
  components: { Permission },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        name: null
      },
      role: {
        id: undefined,
        name: ''
      },
      role_permission: {
        role_id: undefined,
        role_name: '',
        permission_ids: []
      },
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
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
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetRole() {
      this.role = {
        id: undefined,
        name: ''
      }
    },
    resetRolePermission() {
      this.role_permission = {
        role_id: undefined,
        role_name: '',
        permission_ids: []
      }
    },
    handleCreate() {
      this.resetRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.role = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlerPermission(row) {
      this.resetRolePermission()
      this.role_permission.role_id = row.id
      this.role_permission.role_name = row.name
      getPermissionByRole(this.role_permission.role_id).then((res) => {
        this.role_permission.permission_ids = res.data
      })
      this.dialogPermissionVisible = true
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRole(this.role).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editRole(this.role).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row) {
      const deleteData = { id: row.id }
      deleteRole(deleteData).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    savePermission() {
      this.$refs['dataFormPermission'].validate((valid) => {
        if (valid) {
          delete this.role_permission.role_name
          console.log(this.role_permission)
          editRolePermission(this.role_permission).then(() => {
            this.getList()
            this.dialogPermissionVisible = false
            this.$notify({
              title: '成功',
              message: '角色权限配置成功',
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
    hasCheckOpinion(val) {
      console.log('父级：' + val.toString().split(','))
      console.log(val)
      this.role_permission.permission_ids = val
    }
  }
}
</script>
