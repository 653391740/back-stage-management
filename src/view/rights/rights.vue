<script>
  import { Getrights } from '@/api/http'

  export default {
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      async _Getrights() {
        const res = await Getrights('list')
        this.tableData = res
      }
    },
    mounted() {
      this._Getrights()
    },
  }
</script>
<template>
  <div>
    <el-table :data="tableData" width="100%" height="100%">
      <el-table-column prop="id">
      </el-table-column>
      <el-table-column label="权限名称" prop="authName">
      </el-table-column>
      <el-table-column label="路径" prop="path">
      </el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag :type="scope.row.level === '0' ? '' : scope.row.level === '1' ? 'success' : 'danger'">
            {{ scope.row.level === '0' ? '一级' : scope.row.level === '1' ? '二级' : '三级' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
