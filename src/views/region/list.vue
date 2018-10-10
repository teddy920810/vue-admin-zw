<template>
  <div class="app-container">
    <tree-table :data="data" :columns="columns" border/>
  </div>
</template>
<script>
import treeTable from '@/components/TreeTable'
import { getRegion } from '@/api/region'

export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          text: '事件',
          value: 'title',
          width: 200
        },
        {
          text: 'ID',
          value: 'id'
        }
      ],
      data: [
        {
          id: 0,
          title: '事件1'
        },
        {
          id: 1,
          title: '事件1',
          children: [
            {
              id: 2,
              title: '事件2'
            },
            {
              id: 3,
              title: '事件3'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.getRegionJson()
  },
  methods: {
    getRegionJson() {
      getRegion().then(response => {
        this.data = response.data
      })
    }
  }
}
</script>
