<template>
  <div class="app-container">
    <tree-table :data="list" border>
      <el-table-column label="评论">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收藏">
        <template slot-scope="scope">
          <span>{{ scope.row.likes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
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
import treeTable from '@/components/TreeTable'
import { getCommentList, deleteComment } from '@/api/question'

export default {
  name: 'QuComment',
  components: { treeTable },
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
      console.log(list)
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
      const delData = { id: row.id }
      deleteComment(delData).then(() => {
        this.getComment()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
