<script>
  import { Getorders } from '@/api/http'
  import Pagination from '@/components/Pagination.vue'
  import Search from '@/components/Search.vue'
  export default {
    components: {
      Pagination,
      Search
    },
    filters: {
      formatTimestamp(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleString()
      }
    },
    data() {
      return {
        pageData: {
          pagenum: 1,
          pagesize: 20,
          query: ''
        },
        total: 0,
        formData: {
          category: '',
          address: ''
        },
        data: [],
        tableData: [],
        dialogFormVisible: false,
      }
    },
    methods: {
      async _Getorders() {
        const { total, goods } = await Getorders(this.pageData)
        this.tableData = goods
        this.total = total
      },
      handleSizeChange(val) {
        this.pageData.pagesize = val
      },
      handleCurrentChange(val) {
        this.pageData.pagenum = val
      },
    },
    watch: {
      pageData: {
        handler() {
          this._Getorders()
        },
        deep: true,
        immediate: true
      }
    },
  }
</script>
<template>
  <div>
    <el-dialog title="修改地址" :visible.sync="dialogFormVisible">
      <el-form :model="formData" ref="formRef" label-width="100px">

        <el-form-item label="省市区/县" prop="order_number">
          <el-cascader v-model="formData.category" :data="data"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="order_price">
          <el-input v-model="formData.address" placeholder="请输入订单价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>



    <search @search="pageData.query = $event">
    </search>
    <!-- 表格 -->
    <el-table :data="tableData" width="100%" height="calc(100% - 112px)">
      <el-table-column fixed>
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="order_number" label="订单编号">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格">
      </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag :type="scope.row.pay_status === 1 ? 'success' : 'danger'">{{ scope.row.pay_status === 1 ? '已支付' :
            '未支付'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="dialogFormVisible = true" type="primary" size="small"
            icon="el-icon-edit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="total" :pageData="pageData" :pageSizeOptions="[20, 55, 100, 200]"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"></pagination>
  </div>
</template>
<style scoped lang="scss">
  .search {
    width: 500px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
</style>