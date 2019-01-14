<template>
  <div class="app-container">
    <el-table :data="list" fit highlight-current-row>
      <el-table-column label="用户">
        <template slot-scope="scope">
          <img v-if="scope.row.member_head_pic" :src="GLOBAL.fileBaseUrl + scope.row.member_head_pic" width="50" height="50">
          <img v-else src="@/assets/img/webwxgetmsgimg.png" width="50" height="50"><br>
          <span>{{ scope.row.member_nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被评论内容">
        <template slot-scope="scope">
          <span v-if="scope.row.reply_id != 0">{{ scope.row.reply_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被赞数">
        <template slot-scope="scope">
          <span>{{ scope.row.likes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteData(scope.row)">删除</el-button>
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
  </div>
</template>
<script>
import { getCommentList, deleteComment } from '@/api/question'

export default {
  name: 'QuComment',
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        page_size: 10,
        question_id: undefined
      }
    }
  },
  created() {
    const qu_id = this.$route.params && this.$route.params.qu_id
    this.listQuery.question_id = qu_id
    this.getComment()
  },
  methods: {
    getComment() {
      getCommentList(this.listQuery).then(response => {
        if (response.data.list) {
          this.list = this.analyzeCommentData(response.data.list)
        }
        this.total = response.data.total
      })
    },
    toJson(str) {
      const _str = (new Function('', 'return ' + str))()
      return _str
    },
    analyzeCommentData(list) {
      for (const index in list) {
        const replyObj = this.toJson(list[index].reply_json)
        list[index].children = replyObj
      }
      return list
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getComment()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getComment()
    },
    deleteData(row) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delData = { id: row.id }
        deleteComment(delData).then(() => {
          this.getComment()
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
    }
  }
}
</script>
