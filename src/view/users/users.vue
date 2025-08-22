<script>
  import {
    Getuserlist,
    Postusers,
    Putusers_status,
    Putusers,
    Deleteusers,
    Putusersrid,
    Getroles
  } from '@/api/http'
  import Pagination from '@/components/Pagination.vue'
  import Search from '@/components/Search.vue'
  export default {
    components: {
      Pagination,
      Search,
    },
    data() {
      return {
        formRef: null,
        pageData: {
          pagenum: 1,
          pagesize: 10,
          query: ''
        },
        total: 0,
        dialogStates: {
          add: false,
          edit: false,
          delete: false,
          update: false
        },
        tableData: [],
        FormData: {
          username: '',
          password: '',
          email: '',
          mobile: '',
          role_name: '',
          rid: '',
          id: 0
        },
        rolelist: [],
        loading: false,
      }
    },
    watch: {
      pageData: {
        handler() {
          this._Getuserlist()
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      this.originalFormData = { ...this.FormData }
    },
    methods: {
      // ============ 分页处理方法 ============
      handleSizeChange(val) {
        this.pageData.pagesize = val
      },
      handleCurrentChange(val) {
        this.pageData.pagenum = val
      },

      // ============ 对话框控制方法 ============
      opendialogStates(type, item) {
        this.dialogStates[type] = true
        this.FormData = item

        switch (type) {
          case 'edit':
            this.FormData.email = item.email
            this.FormData.mobile = item.mobile
            this.FormData.username = item.username
            break
          case 'delete':
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this._Deleteusers()
            }).catch(() => {
              this.$message.info('已取消删除')
            })
            break
          case 'update':
            this.FormData.username = item.username
            this.FormData.role_name = item.role_name
            this._Getroles()
            break
        }
      },

      // ============ 表单提交和重置方法 ============
      submitForm(type) {
        this.$refs[type].validate(valid => {
          if (!valid) return false

          try {
            switch (type) {
              case 'add':
                this._Postusers()
                break
              case 'edit':
                this._Putusers()
                break
              case 'update':
                const { id, rid } = this.FormData
                this._Putusersrid(id, rid)
                break
            }
            this.resetForm(type)
          } catch (error) {
            console.error('表单提交失败:', error);
          }
        })
      },

      resetForm(type) {
        this.$refs[type].resetFields()
        this.dialogStates[type] = false
        if (type === 'edit' || type === 'add') {
          this.FormData = { ...this.originalFormData }
        }
      },

      // ============ API 数据获取方法 ============
      async _Getuserlist() {
        if (this.loading) return

        this.loading = true
        try {
          const { total, users } = await Getuserlist(this.pageData)
          this.total = total
          this.tableData = users || []
        } catch (err) {
          console.error('获取用户列表失败:', err)
        } finally {
          this.loading = false
        }
      },

      async _Getroles() {
        if (this.rolelist.length > 0) return // 避免重复请求

        try {
          const res = await Getroles()
          this.rolelist = res
        } catch (err) {
          console.error('获取角色列表失败:', err)
        }
      },

      // ============ 用户操作方法 ============
      async _Postusers() {
        if (!this.validateRequiredFields()) return

        try {
          await Postusers(this.FormData)
          this._Getuserlist()
        } catch (err) {
          console.error('添加用户失败:', err)
        }
      },

      async _Putusers() {
        const { email, mobile } = this.FormData
        try {
          await Putusers(this.FormData.id, { email, mobile })
          this._Getuserlist()
        } catch (err) {
          console.error('编辑用户失败:', err)
        }
      },

      async _Putusers_status(item) {
        try {
          await Putusers_status(item.id, item.mg_state)
        } catch (err) {
          console.error('修改状态失败:', err)
          // 恢复原始状态
          item.mg_state = !item.mg_state
        }
      },

      async _Deleteusers() {
        try {
          await Deleteusers(this.FormData.id)
          this._Getuserlist()
        } catch (err) {
          console.error('删除用户失败:', err)
        }
      },

      async _Putusersrid(id, rid) {
        if (!rid) return this.$message.error('请选择角色')
        try {
          await Putusersrid(id, { rid })
          this._Getuserlist()
        } catch (err) {
          console.error('修改角色失败:', err)
        }
      },

      // ============ 工具方法 ============


      validateRequiredFields() {
        if (!this.FormData.username) {
          this.$message.error('用户名为必填项')
          return false
        }
        if (!this.FormData.password) {
          this.$message.error('密码为必填项')
          return false
        }
        return true
      },
    },

    computed: {
      dynamicRules() {

        return {
          username: [
            { required: !this.dialogStates.edit, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          email: [
            {
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                if (!this.dialogStates.add) {
                  callback()
                } else {
                  if (!value) {
                    callback(new Error('请输入邮箱地址'))
                  } else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
                    callback(new Error('请输入正确的邮箱地址'))
                  } else {
                    callback()
                  }
                }
              }
            }
          ],
          mobile: [
            {
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                if (!this.dialogStates.add) {
                  callback()
                } else {
                  if (!value) {
                    callback(new Error('请输入手机号码'))
                  } else if (!/^1[3456789]\d{9}$/.test(value)) {
                    callback(new Error('请输入正确的手机号码'))
                  } else {
                    callback()
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
</script>

<template>
  <div class="users">
    <!-- 搜索和添加 -->
    <search @search="pageData.query = $event">
      <el-button type="primary" @click="dialogStates.add = true">添加用户</el-button>
    </search>


    <!-- 表格 -->
    <el-table :data="tableData" width="100%" height="calc(100% - 112px)">
      <el-table-column fixed prop="id" label="ID" min-width="120"></el-table-column>
      <el-table-column prop="username" label="姓名" min-width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="120"></el-table-column>
      <el-table-column prop="mobile" label="电话" min-width="120"></el-table-column>
      <el-table-column prop="role_name" label="角色" min-width="120"></el-table-column>
      <el-table-column label="状态" min-width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="_Putusers_status(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button @click.native.prevent="opendialogStates('edit', scope.row)" type="primary" size="medium"
            icon="el-icon-edit"></el-button>
          <el-button @click.native.prevent="opendialogStates('delete', scope.row)" type="danger" size="medium"
            icon="el-icon-delete-solid"></el-button>
          <el-button @click.native.prevent="opendialogStates('update', scope.row)" type="warning" size="medium"
            icon="el-icon-s-tools"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :total="total" :pageData="pageData" :pageSizeOptions="[10, 20, 30, 40]" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></pagination>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogStates.add">
      <el-form :model="FormData" :rules="dynamicRules" ref="add" label-width="100px">
        <el-form-item label="用户" label-width="80px" prop="username">
          <el-input v-model="FormData.username" autocomplete="new-password" :data-autofill="false"
            name="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="FormData.password" type="password" autocomplete="new-password" :data-autofill="false"
            name="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="FormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px" prop="mobile">
          <el-input v-model="FormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('add')">取 消</el-button>
        <el-button type="primary" @click="submitForm('add')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户弹窗 -->
    <el-dialog title="编辑用户" :visible.sync="dialogStates.edit">
      <el-form :model="FormData" :rules="dynamicRules" ref="edit" label-width="100px">
        <el-form-item label="用户" label-width="80px" prop="username">
          <el-input v-model="FormData.username" disabled autocomplete="new-password" :data-autofill="false"
            name="username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="FormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px" prop="mobile">
          <el-input v-model="FormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('edit')">取 消</el-button>
        <el-button type="primary" @click="submitForm('edit')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogStates.update">
      <el-form :model="FormData" ref="update">
        <el-form-item label="当前用户" label-width="90px">
          {{ FormData.username }}
        </el-form-item>
        <el-form-item label="当前角色" label-width="90px">
          {{ FormData.role_name }}
        </el-form-item>
        <el-form-item label="分配新角色" label-width="90px">
          <el-select v-model="FormData.rid" placeholder="请选择新角色">
            <el-option v-for="e in rolelist" :key="e.id" :label="e.roleName" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('update')">取 消</el-button>
        <el-button type="primary" @click="submitForm('update')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
  .users {
    .search {
      width: 500px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .input-with-select {
        margin-right: 10px;
      }
    }
  }
</style>