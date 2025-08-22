<template>
  <div style="height: calc(100% - 80px);">
    <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>

    <!-- 分类列表 -->
    <el-table :data="categoryList" style="margin: 20px 0;" row-key="cat_id" width="100%" height="100%" border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="#" type="index">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="cat_level" label="是否有效">
        <template slot-scope="scope">
          <span :class="scope.row.cat_deleted ? 'el-icon-error' : 'el-icon-success'"
            :style="{ color: scope.row.cat_deleted ? '' : '#7ac756' }"></span>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-tag :type="scope.row.cat_level === 0 ? '' : scope.row.cat_level === 1 ? 'success' : 'danger'">{{
            scope.row.cat_level === 0 ? '一级' : scope.row.cat_level === 1 ? '二级' : '三级' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)"
            class="edit-btn">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="small"
            @click="removeParam(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="60%">
      <el-form :model="form" :rules="rules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>

        <el-form-item label="分类名称">
          <el-cascader v-model="selectedKeys" :options="categoryList" clearable :show-all-levels="false"
            @change="categoryChange"
            :props="{ value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true }"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogClose">取消</el-button>
        <el-button type="primary" @click="addsubmitForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类弹窗 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="60%">
      <el-form :model="form" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogClose">取消</el-button>
        <el-button type="primary" @click="editsubmitForm">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    Getcategories,
    Putcategories,
    Postcategories,
    Deletecategories
  } from '@/api/http.js'
  export default {
    data() {
      return {
        categoryList: [], //分类数据
        selectedKeys: [],
        addDialogVisible: false,
        editDialogVisible: false,
        form: {
          cat_pid: 0,
          cat_name: ''
        },
        rules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
        }
      }
    },
    computed: {

    },
    methods: {
      removeParam(id) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await Deletecategories(id)
            this._Getcategories()
          } catch (e) {
            console.error(e);
          }
        }).catch(() => {
          this.$message.info('取消删除')
        });
      },

      categoryChange() { // 级联选择器改变时触发
        if (this.selectedKeys.length === 3) return this.selectedKeys = [];
        this.form.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      },


      // 编辑
      showEditDialog(row) {
        this.editDialogVisible = true
        this.id = row.cat_id
        this.form.cat_name = row.cat_name
      },

      editDialogClose() { // 编辑分类弹窗关闭时触发
        this.selectedKeys = []
        this.editDialogVisible = false
        this.$refs.editFormRef.resetFields()

        console.log(this.form);
      },
      editsubmitForm() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await Putcategories(this.id, { cat_name: this.form.cat_name })
              this.editDialogClose()
              this._Getcategories()
            } catch (e) {
              console.error(e);
            }
          }
        })
      },



      // 添加
      addDialogClose() { // 添加分类弹窗关闭时触发
        this.selectedKeys = []
        this.addDialogVisible = false
        this.$refs.addFormRef.resetFields()
      },
      addsubmitForm() { // 添加分类弹窗确定按钮点击时触发
        this.$refs.addFormRef.validate(async (valid) => {
          if (valid) {
            try {
              await Postcategories({ ...this.form, cat_level: this.selectedKeys.length })
              this.addDialogClose()
              this._Getcategories()
            } catch (e) {
              console.error(e);
            }
          }
        })
      },

      async _Getcategories() {
        try {
          this.categoryList = await Getcategories()
        } catch (e) {
          console.log(e)
        }
      }
    },

    mounted() {
      this._Getcategories()
    }
  }
</script>
