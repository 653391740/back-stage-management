<template>
  <div>
    <!-- 头部警告区域 -->
    <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

    <!-- 选择商品分类区域 -->
    <el-row class="selectCategory">
      <el-col>
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联选择框 -->
        <el-cascader v-model="selectedKeys" :options="categoryList" clearable :show-all-levels="false"
          @change="categoryChange" :props="{ value: 'cat_id', label: 'cat_name', children: 'children' }"></el-cascader>
      </el-col>
    </el-row>

    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="height: calc(100% - 95px);">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" @click="addDialogVisible = true" :disabled="!categoryId">添加参数</el-button>
        <!-- 动态参数标签页内容 -->
        <div class="tab-pane-content">
          <el-table :data="manyTableData" border height="100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag v-if="props.row.attr_vals" :key="tag" v-for="tag in props.row.attr_vals.split(',')" closable
                  :disable-transitions="false" @close="handleClose(props.row, tag)">
                  {{ tag }}
                </el-tag>
                <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model.trim="inputValue"
                  :ref="props.row.attr_id" size="small" @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New
                  Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)" class="edit-btn">
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" @click="addDialogVisible = true" :disabled="!categoryId">添加属性</el-button>
        <!-- 静态属性标签页内容 -->
        <div class="tab-pane-content">
          <el-table :data="onlyTableData" border>

            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag v-if="props.row.attr_vals" :key="tag" v-for="tag in props.row.attr_vals.split(',')" closable
                  :disable-transitions="false" @close="handleClose(props.row, tag)">
                  {{ tag }}
                </el-tag>
                <el-input class="input-new-tag" v-if="props.row.inputVisible" v-model.trim="inputValue"
                  :ref="props.row.attr_id" size="small" @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New
                  Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column label="属性名称" prop="attr_name"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)" class="edit-btn">
                </el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加动态参数/静态属性的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数/静态属性的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    Getcategories,
    GetcategoriestabHandle,
    PostcategoriestabHandle,
    PutcategoriestabHandle,
    DeltcategoriestabHandle
  } from '@/api/http'
  export default {
    data() {
      return {
        categoryList: [], // 分类数据
        selectedKeys: [], // 级联选择框中选中项的数组

        activeName: 'many', // 选项卡的当前活动名称
        manyTableData: [], // 动态参数数据
        onlyTableData: [], // 静态属性数据

        // 添加对话框相关数据
        addDialogVisible: false,
        addForm: {
          attr_name: "",
        },
        inputValue: '',
        // 编辑对话框相关数据
        editDialogVisible: false,
        editForm: {
          attr_name: "",
          attr_id: ""
        },

        // 表单验证规则
        formRules: {
          attr_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this._Getcategories();
    },
    computed: {
      titleText() {
        return this.activeName === 'many' ? '动态参数' : '静态属性';
      },

      activeData: {
        get() {
          return this.activeName === 'many' ? this.manyTableData : this.onlyTableData
        },
        set(newValue) {
          if (this.activeName === 'many') {
            this.manyTableData = newValue
          } else {
            this.onlyTableData = newValue
          }
        }
      },

      categoryId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2];
        }
        return null;
      }
    },
    methods: {
      // 标签删除
      handleClose(tag, tagName) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          const arr = tag.attr_vals.split(',')
          tag.attr_vals = arr.filter(item => item !== tagName).join(',')
          this._PutcategoriestabHandle(tag)
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },

      // 标签添加
      handleInputConfirm(tag) {
        if (this.inputValue) { // 输入框有值时字符串转数组进行判断是否有相同的值
          let arr = tag.attr_vals.split(',')
          if (arr.includes(this.inputValue)) {
            this.$message.error('属性值已存在')
          } else {
            // 没有就添加进去
            arr.push(this.inputValue)
            // 检查转换后的数组第一个值是否为空
            if (arr[0] === '') arr.splice(0, 1)
            // 处理完成后，将数组转换为字符串赋值给属性值
            tag.attr_vals = arr.join(',')
            this._PutcategoriestabHandle(tag)
          }
        }
        tag.inputVisible = false;
      },

      // 编辑参数
      editParam() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          // 根据id查找要编辑的参数项
          const item = this.activeData.find(item => item.attr_id === this.editForm.attr_id)
          // 更新参数名称
          item.attr_name = this.editForm.attr_name
          // 调用更新参数的方法
          await this._PutcategoriestabHandle(item)
          this.editDialogClose()
        })
      },

      // 更新参数函数
      async _PutcategoriestabHandle(row) {
        const { attr_id, attr_name, attr_sel, attr_vals } = row
        try {
          await PutcategoriestabHandle(this.categoryId, attr_id, { attr_name, attr_sel, attr_vals })
        } catch (e) {
          console.log(e);
        }
        this.inputValue = '';
      },

      // 删除参数
      removeParam(attrId) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            await DeltcategoriestabHandle(this.categoryId, attrId)
            this.activeData = this.activeData.filter(item => item.attr_id !== attrId)
          } catch {
            console.error(e);
          }
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      },

      // 控制显示输入框
      showInput(row) {
        row.inputVisible = true;
        this.$nextTick(() => {
          const ref = this.$refs[row.attr_id];
          if (ref && ref.$refs && ref.$refs.input) {
            ref.$refs.input.focus();
          }
        });
      },

      // 获取商品分类
      async _Getcategories() {
        try {
          const { result } = await Getcategories({ pagenum: 1, pagesize: 100 })
          this.categoryList = result
        } catch (e) {
          console.error(e)
        }
      },

      // 选择项发送变化触发的函数
      categoryChange() {
        // 只允许选择第三级分类
        if (this.selectedKeys.length < 3) return this.selectedKeys = [];
        this._GetcategoriestabHandle();
      },

      // tab标签页切换调用获取其他参数列表
      handleTabClick() {
        // 切换标签页时重新加载参数列表
        if (this.categoryId) {
          this._GetcategoriestabHandle();
        }
      },

      // 获取参数列表
      async _GetcategoriestabHandle() {
        try {
          const res = await GetcategoriestabHandle(this.categoryId, { sel: this.activeName })
          this.activeData = res.map(item => ({
            ...item,
            inputVisible: false,
          }))
        } catch (e) {
          console.error(e)
        }
      },

      // 添加参数相关方法
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
        this.addDialogVisible = false
      },

      addParam() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          try {
            const res = await PostcategoriestabHandle(this.categoryId, {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            })
            this.activeData.push({
              ...res,
              inputVisible: false,
            })
          } catch {
            console.error(e)
          }
        })
        this.addDialogClose()
      },

      // 编辑参数相关方法
      showEditDialog(item) {
        this.editDialogVisible = true;
        this.editForm.attr_id = item.attr_id
        this.editForm.attr_name = item.attr_name
      },

      editDialogClose() {
        this.editDialogVisible = false
        this.$refs.editFormRef.resetFields();
      },
    }
  }
</script>

<style scoped>
  .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .selectCategory {
    margin-top: 15px;
  }

  .tab-pane-content {
    margin-top: 15px;
    height: calc(100% - 55px);
  }

  .edit-btn {
    display: inline-block;
    margin-right: 5px;
  }

  ::v-deep .el-tabs__content {
    height: calc(100% - 55px);

    .el-tab-pane {
      height: 100%;
    }
  }
</style>
