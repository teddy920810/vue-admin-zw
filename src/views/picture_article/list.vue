<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="搜索名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="hasButton('PP_IMAGE_TEXT_ADD')" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row>
      <el-table-column label="封面图" width="110">
        <template slot-scope="scope">
          <img :src="GLOBAL.fileBaseUrl + scope.row.first_image" width="100" height="50">
        </template>
      </el-table-column>
      <el-table-column label="政务号" align="center">
        <template slot-scope="scope">
          {{ scope.row.office_name }}
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="是否置顶" align="center" width="80">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.is_top | topFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="封面图显示" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.show_first_image | imgFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="hasButton('PP_IMAGE_TEXT_DETAIL')" type="info" size="mini" @click="handleImgDetail(scope.row)">查看详情</el-button>
          <router-link :to="'/picart/comment/'+scope.row.id">
            <el-button v-if="hasButton('PP_COMMENT_IMAGETEXT_MANAGE')" type="primary" size="mini">评论管理</el-button>
          </router-link>
          <el-button v-if="hasButton('PP_IMAGE_TEXT_EDIT')" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="hasButton('PP_IMAGE_TEXT_DEL')" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteData(scope.row)"/>
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
    <!-- 新增/修改类别 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="picart" label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="所属分类" prop="category_id">
          <el-select v-model="picart.category_id" placeholder="请选择类型">
            <el-option v-for="item in selectOption" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="picart.title"/>
        </el-form-item>
        <el-form-item label="是否置顶" prop="is_top">
          <el-select v-model="picart.is_top" placeholder="请选择">
            <el-option label="不置顶" value="0"/>
            <el-option label="置顶" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示图片" prop="show_first_image">
          <el-select v-model="picart.show_first_image" placeholder="请选择">
            <el-option label="不显示" value="0"/>
            <el-option label="显示小图" value="1"/>
            <el-option label="显示大图" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="first_image">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :action="GLOBAL.uploadFileUrl"
            :headers="myHeader"
            class="avatar-uploader">
            <img v-if="picart.first_image" :src="GLOBAL.fileBaseUrl+picart.first_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
          封面图片建议尺寸：大图显示： 690*286 小图显示：200*200
        </el-form-item>
        <!--<el-form-item label="纯文本内容" prop="pure_content">
          <el-input v-model="picart.pure_content"/>
        </el-form-item>-->
        <el-form-item label="内容" prop="content" style="height: 280px">
          <quill-editor ref="myQuillEditor" v-model="picart.content" :options="editorOption" style="height: 200px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetailVisible" title="图文详情" width="60%">
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="标题">
          <span>{{ imgTextDetail.title }}</span>
        </el-form-item>
      </el-form>
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="政务号">
          <span>{{ imgTextDetail.office_name }}</span>
        </el-form-item>
      </el-form>
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="政务号指数">
          <span>{{ imgTextDetail.office_index }}</span>
        </el-form-item>
      </el-form>
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="点赞数">
          <span>{{ imgTextDetail.likes }}</span>
        </el-form-item>
      </el-form>
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="发布时间">
          <span>{{ imgTextDetail.create_time | timeFilter }}</span>
        </el-form-item>
      </el-form>
      <!--<el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="纯文本内容">
          <span>{{ imgTextDetail.pure_content }}</span>
        </el-form-item>
      </el-form>-->
      <el-form label-position="left" label-width="120px" style="margin-left:50px;">
        <el-form-item label="内容" prop="title">
          <div v-html="imgTextDetail.content">{{ imgTextDetail.content }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillRedefine } from 'vue-quill-editor-upload'
import { quillEditor } from 'vue-quill-editor'
import { getList, addData, editData, deleteData, getImgDetail, getImageCategoryList } from '@/api/imagetext'
import { getToken } from '@/utils/auth'

const token = getToken()
export default {
  components: {
    quillEditor, quillRedefine
  },
  filters: {
    imgFilter(show) {
      const showMap = {
        0: '不显示',
        1: '显示小图',
        2: '显示大图'
      }
      return showMap[show]
    },
    topFilter(top) {
      const topMap = {
        0: '不置顶',
        1: '置顶'
      }
      return topMap[top]
    }
  },
  data() {
    return {
      myHeader: { 'token': token },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        title: null
      },
      picart: {
        id: undefined,
        title: '',
        content: '',
        category_id: '',
        first_image: '',
        show_first_image: '',
        is_top: ''
        // pure_content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        first_image: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        show_first_image: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        is_top: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
        /* pure_content: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]*/
      },
      selectOption: [],
      dialogDetailVisible: false,
      imgTextDetail: {
        title: '',
        content: '',
        user_id: '',
        create_time: '',
        likes: '',
        office_name: '',
        office_index: ''
        // pure_content: ''
      }
    }
  },
  created() {
    this.getList()
    this.getImageCategory()
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          action: this.GLOBAL.uploadFileUrl,
          res: (response) => {
            return this.GLOBAL.fileBaseUrl + response.data
          },
          name: 'file'
        },
        placeholder: '您想说点什么？'
      }
    )
  },
  methods: {
    getImageCategory() {
      getImageCategoryList().then(response => {
        this.selectOption = response.data
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetPicart() {
      this.picart = {
        id: undefined,
        title: '',
        content: '',
        category_id: '',
        first_image: '',
        show_first_image: '',
        is_top: ''
        // pure_content: ''
      }
    },
    handleCreate() {
      this.resetPicart()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addData(this.picart).then(() => {
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
    handleUpdate(row) {
      this.picart = Object.assign({}, row) // copy obj
      this.picart.show_first_image = this.picart.show_first_image + ''
      this.picart.is_top = this.picart.is_top + ''
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editData(this.picart).then(() => {
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
    deleteData(row) {
      this.$confirm('此操作将永久删除该图文, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delData = { id: row.id }
        deleteData(delData).then(() => {
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
    handleImgDetail(row) {
      const param = { id: row.id }
      getImgDetail(param).then(response => {
        this.imgTextDetail = response.data
        this.dialogDetailVisible = true
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
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleSuccess(res, file) {
      this.picart.first_image = res.data
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
    width: 240px;
    height: 120px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 240px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 240px;
    height: 120px;
    display: block;
  }
  /**
    汉化富文本编辑器
   */
  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '标准';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题 1';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题 2';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题 3';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题 4';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题 5';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题 6';
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '标准';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '小';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '大';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '巨大';
  }
  .ql-snow .ql-tooltip::before {
    content: "访问网址:";
    line-height: 26px;
    margin-right: 8px;
  }
  .ql-snow .ql-tooltip a.ql-action::after {
    border-right: 1px solid #ccc;
    content: '编辑';
    margin-left: 16px;
    padding-right: 8px;
  }
  .ql-snow .ql-tooltip a.ql-remove::before {
    content: '删除';
    margin-left: 8px;
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "输入链接:";
  }
  .ql-snow .ql-tooltip[data-mode=formula]::before {
    content: "输入公式:";
  }
  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "输入视频:";
  }
</style>
