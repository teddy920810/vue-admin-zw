<template>
  <el-cascader
    :options="regions"
    :props="props"
    v-model="selectOption"
    placeholder="选择地区"
    @active-item-change="handleItemChange"
    @change="handleValueChang"/>
</template>

<script>
import { getRegion } from '@/api/region'
export default {
  props: {
    selectOption: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      props: {
        label: 'title',
        value: 'id',
        children: 'children'
      },
      regions: [{
        label: '江苏',
        cities: [{
          label: '南京'
        }]
      }, {
        label: '浙江',
        cities: [{
          label: '杭州'
        }]
      }]
    };
  },
  created() {
    this.getRegionJson()
  },
  methods: {
    handleItemChange(val) {
      //console.log('active item:', val);
    },
    handleValueChang(val) {
      console.log('the val:', val)
      this.$emit('selectRegion', val)
    },
    getRegionJson() {
      getRegion().then(response => {
        this.regions = response.data
      })
    }
  }
}
</script>
