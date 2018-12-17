<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
    澎湃新闻组件管理平台
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="完善政务号信息">
      <el-form ref="dataForm" :rules="rules" :model="government" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
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
          图片建议尺寸：100*1000
        </el-form-item>
        <el-form-item label="描述" prop="office_desc">
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
          图片建议尺寸：100*1000
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { initGovernment } from '@/api/government'
import Region from '../region/index.vue'
import { getToken } from '@/utils/auth'

const token = getToken()
export default {
  name: 'Dashboard',
  components: { Region },
  data() {
    return {
      myHeader: { 'token': token },
      dialogFormVisible: false,
      government: {
        user_id: undefined,
        name: '',
        desc: '',
        index: '',
        province_id: '',
        city_id: '',
        banner_pic: '',
        head_pic: ''
      },
      rules: {
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
          { validator(r, v, b) { (/^[\d]*$/).test(v) ? b() : b(new Error('请填写数字')) } }
        ],
        head_pic: [
          { required: true, message: '请上传', trigger: 'blur' }
        ],
        banner_pic: [
          { required: true, message: '请上传', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'addRouters'
    ])
  },
  created() {
    this.dialogFormVisible = Object.is('', this.name)
    if (this.roles.length === 0) {
      this.$router.push({ path: '/401' })
    } else if (this.addRouters.length > 0) {
      this.$router.push({ path: this.addRouters[0].path })
    }
  },
  methods: {
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          initGovernment(this.government).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: this.addRouters[0].path })
          })
        }
      })
    },
    selectRegion(data) {
      this.government.province_id = data[0]
      this.government.city_id = data[1]
    },
    beforeHeadUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    beforeBannerUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleBannerSuccess(res, file) {
      this.government.banner_pic = res.data
    },
    handleHeadSuccess(res, file) {
      this.government.head_pic = res.data
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
