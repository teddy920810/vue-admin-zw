<script>
/* const uploadFileUrl = 'http://192.168.14.50:8888/news/Upload/imgUpload'
const servicePath = 'http://192.168.14.50:8888' */
const uploadFileUrl = process.env.BASE_API + '/Upload/imgUpload'
const fileBaseUrl = process.env.IMG_API
const servicePath = process.env.BASE_API

export default {
  uploadFileUrl,
  servicePath,
  fileBaseUrl
}
</script>
