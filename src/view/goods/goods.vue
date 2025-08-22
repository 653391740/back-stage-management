<script>
  import { Getgoods, Deletegoods } from '@/api/http'
  import Pagination from '@/components/Pagination.vue'
  import Search from '@/components/Search.vue'

  export default {
    components: {
      Pagination,
      Search
    },
    data() {
      return {
        pageData: {
          pagenum: 1,
          pagesize: 20,
          query: ''
        },
        total: 0,
        tableData: [],
        loading: false,
      }
    },

    methods: {
      // ========== 数据获取相关方法 ==========
      async _Getgoods() {
        // 防抖处理，避免重复请求
        this.loading = true

        try {
          const { total, goods } = await Getgoods(this.pageData)
          this.tableData = goods
          this.total = total
        } catch (error) {
          console.error('获取商品列表失败:', error)
          this.tableData = []
          this.total = 0
        } finally {
          this.loading = false
        }
      },

      // ========== 分页控制相关方法 ==========
      handleSizeChange(val) {
        const pageSize = parseInt(val)
        if (pageSize && pageSize > 0 && pageSize <= 200) {
          this.pageData.pagesize = pageSize
        }
      },

      handleCurrentChange(val) {
        const pageNum = parseInt(val)
        if (pageNum && pageNum > 0) {
          this.pageData.pagenum = pageNum
        }
      },

      // ========== 删除操作相关方法 ==========
      async _Deletegoods(id) {
        if (!id || typeof id !== 'number') {
          this.$message({ type: 'error', message: '无效的商品ID' })
          return
        }

        try {
          await Deletegoods(id)
          this.tableData = this.tableData.filter(item => item.goods_id !== id)
          this.total = Math.max(0, this.total - 1)
        } catch (error) {
          console.error('删除商品失败:', error)
        }
      },

      del(id) {
        if (!id) {
          this.$message({ type: 'error', message: '无效的商品ID' })
          return
        }

        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._Deletegoods(id)
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
      },
    },

    watch: {
      pageData: {
        handler() {
          this._Getgoods()
        },
        deep: true,
        immediate: true
      }
    },
  }
</script>
<template>
  <div>
    <search @search="pageData.query = $event">
      <el-button type="primary" @click="$router.push('/home/add')">添加商品</el-button>
    </search>

    <!-- 表格 -->
    <el-table :data="tableData" width="100%" height="calc(100% - 112px)" v-loading="loading"
      element-loading-text="加载中..." element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column fixed min-width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" min-width="150">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" min-width="120">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量(kg)" min-width="120">
      </el-table-column>
      <el-table-column prop="upd_time" label="创建时间" min-width="160">
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button @click.native.prevent="$router.push({ path: '/home/add', query: { id: scope.row.goods_id } })"
            type="primary" size="medium" icon="el-icon-edit"></el-button>

          <el-button @click.native.prevent="del(scope.row.goods_id)" type="danger" size="medium"
            icon="el-icon-delete-solid"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="total" :pageData="pageData" :pageSizeOptions="[20, 55, 100, 200]"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"></pagination>
  </div>
</template>