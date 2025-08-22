<script>
  import {
    Getroles,
    Deleterolesrights,
    Putroles,
    Deleteroles,
    Getrights,
    Postroles,
    Postrolesrights
  } from '@/api/http'

  export default {
    name: 'roles',
    data() {
      return {
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ]
        },
        tableData: [],
        FormData: {
          roleName: '',
          roleDesc: ''
        },
        originalFormData: {},
        dialogStates: {
          add: false,
          edit: false,
          updata: false
        },
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defaultCheckedKeys: [],
        treeData: [],
        loading: false
      }
    },
    computed: {
      hasPermissionData() {
        return this.treeData && this.treeData.length > 0
      }
    },
    methods: {
      // 数据获取相关方法
      async fetchRoles() {
        if (this.loading) return
        this.loading = true
        try {
          this.tableData = await Getroles()
        } catch (err) {
          console.error('获取角色列表失败:', err)
        } finally {
          this.loading = false
        }
      },

      async fetchRights() {
        this.loading = true
        try {
          const res = await Getrights('tree')
          this.treeData = res
        } catch (err) {
          console.error('获取权限列表失败:', err)
        } finally {
          this.loading = false
        }
      },

      // 角色管理相关方法
      async addRole() {
        try {
          const { roleName, roleDesc } = this.FormData
          const res = await Postroles({ roleName, roleDesc })
          this.tableData.push(res)
          this.resetForm('add')
        } catch (err) {
          console.error('添加角色失败:', err)
        }
      },

      async editRole() {
        try {
          const { id, roleName, roleDesc } = this.FormData
          const res = await Putroles(id, { roleName, roleDesc })
          const roleIndex = this.tableData.findIndex(item => item.id === res.roleId)
          if (roleIndex !== -1) {
            this.tableData[roleIndex].roleDesc = roleDesc
            this.tableData[roleIndex].roleName = roleName
          }
          this.resetForm('edit')
        } catch (err) {
          console.error('修改角色失败:', err)
        }
      },

      async deleteRole() {
        try {
          await Deleteroles(this.FormData.id)
          this.tableData = this.tableData.filter(item => item.id !== this.FormData.id)
          this.resetForm('del')
        } catch (err) {
          console.error('删除角色失败:', err)
        }
      },

      // 权限管理相关方法
      async assignRoleRights() {
        if (!this.hasPermissionData) {
          this.$message.warning('权限数据未加载')
          return
        }

        try {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
          const rids = [...checkedKeys, ...halfCheckedKeys].join(',')
          await Postrolesrights(this.FormData.id, { rids })
          await this.fetchRoles()
          this.resetForm('updata')
        } catch (err) {
          console.error('分配角色权限失败:', err)
        }
      },

      removeRightById(roleId, rightId) {
        this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const res = await Deleterolesrights(roleId, rightId)
            const roleIndex = this.tableData.findIndex(item => item.id === roleId)
            if (roleIndex !== -1) {
              this.tableData[roleIndex].children = res
            }
          } catch (err) {
            console.error('删除角色权限失败:', err)
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      // 对话框控制相关方法
      openDialog(type, row = {}) {
        this.dialogStates[type] = true

        if (type === 'add') {
          this.FormData = { roleName: '', roleDesc: '' }
        } else if (type === 'edit' || type === 'updata') {
          this.FormData = { ...row }
          if (type === 'updata' && row.children) {
            this.preparePermissionTree(row.children)
          }
        } else if (type === 'del') {
          this.FormData = { ...row }
          this.confirmDelete()
        }
      },

      confirmDelete() {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRole()
        }).catch(() => {
          this.$message.info('已取消删除')
          this.resetForm('del')
        })
      },

      preparePermissionTree(children) {

        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
        this.defaultCheckedKeys = children
          .map(level1 => level1.children
            ? level1.children.map(level2 => level2.children
              ? level2.children.map(level3 => level3.id)
              : [])
            : [])
          .flat(Infinity)
      },

      // 表单提交相关方法
      submitForm(type) {
        if (type === 'updata') {
          this.assignRoleRights()
        } else {
          this.validateAndSubmit(type)
        }
      },

      validateAndSubmit(type) {
        this.$refs[type].validate(valid => {
          if (!valid) {
            this.$message.warning('请填写完整的角色信息')
            return false
          }

          if (type === 'add') {
            this.addRole()
          } else if (type === 'edit') {
            this.editRole()
          }
        })
      },

      resetForm(type) {
        this.dialogStates[type] = false
        this.FormData = { ...this.originalFormData }
        if (type !== 'updata' && this.$refs[type]) {
          this.$refs[type].resetFields()
        }
      },

      // 工具方法
      add() {
        this.openDialog('add')
      }
    },
    mounted() {
      this.fetchRoles()
      this.fetchRights()
      this.originalFormData = { ...this.FormData }
    }
  }
</script>
<template>
  <div>
    <el-button type="primary" size="big" @click="add">添加角色</el-button>
    <div class="scrol">
      <el-table :data="tableData" width="100%" height="calc(100% - 40px)">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row :class="[index1 === 0 ? '' : 'border-top', 'vcenter']" v-for="(item1, index1) in props.row.children"
              :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(props.row.id, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="24">
                <el-row :class="{ 'border-top': index2 !== 0 }" v-for="(item2, index2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(props.row.id, item2.id)" type="success">{{ item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(props.row.id, item3.id)" type="warning"
                      v-for="(item3) in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="openDialog('edit', scope.row)" type="primary" size="mini"
              icon="el-icon-edit"></el-button>
            <el-button @click.native.prevent="openDialog('del', scope.row)" type="danger" size="mini"
              icon="el-icon-delete-solid"></el-button>
            <el-button @click.native.prevent="openDialog('updata', scope.row)" type="warning" size="mini"
              icon="el-icon-s-tools"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogStates.add">
      <el-form :model="FormData" :rules="rules" ref="add" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="FormData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="FormData.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('add')">取 消</el-button>
        <el-button type="primary" @click="submitForm('add')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogStates.edit">
      <el-form :model="FormData" :rules="rules" ref="edit" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="FormData.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="FormData.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('edit')">取 消</el-button>
        <el-button type="primary" @click="submitForm('edit')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogStates.updata">
      <el-tree ref="tree" :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[1, 2, 3]"
        :default-checked-keys="defaultCheckedKeys" :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updata')">取 消</el-button>
        <el-button type="primary" @click="submitForm('updata')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
  .el-table .el-table__cell {
    padding: 0 !important;
  }

  .el-tag {
    margin: 7px;
  }

  .border-top {
    border-top: 1px solid #eee;
  }

  .border-bottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: self-start;
  }

  .scrol {
    margin-top: 20px;
    overflow: scroll;
    height: 100%;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
