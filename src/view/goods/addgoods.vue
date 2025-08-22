<script>
    import {
        Getcategories,
        GetcategoriestabHandle,
        Postgoods,
        Getgoodsid,
        Putgoods
    } from '@/api/http'

    export default {
        data() {
            return {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('token'))
                },
                active: 0,
                options: [],
                manyAttrs: [],
                onlyAttrs: [],
                form: {
                    goods_name: '',
                    goods_price: '',
                    goods_weight: '',
                    goods_number: '',
                    goods_cat: [],
                    goods_introduce: '',
                    pics: []
                },
                rules: {
                    goods_name: [
                        { required: true, message: '请填写商品名称', trigger: 'blur' },
                        { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请填写商品价格', trigger: 'blur' },
                        { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格格式', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (value && parseFloat(value) <= 0) {
                                    callback(new Error('价格必须大于0'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    goods_weight: [
                        { required: true, message: '请填写商品重量', trigger: 'blur' },
                        { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的重量格式', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (value && parseFloat(value) <= 0) {
                                    callback(new Error('重量必须大于0'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    goods_number: [
                        { required: true, message: '请填写商品数量', trigger: 'blur' },
                        { pattern: /^\d+$/, message: '请输入有效的数量格式', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (value && parseInt(value) <= 0) {
                                    callback(new Error('数量必须大于0'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'change' }
                    ]
                },
                fileList: [],
                loading: false,

            }
        },
        computed: {
            isEditMode() {
                return !!this.$route.query.id
            }
        },
        methods: {
            // 获取商品分类
            async fetchCategories() {
                try {
                    const { result } = await Getcategories({ pagenum: 1, pagesize: 100 })
                    this.options = result
                } catch (error) {
                    console.error('获取商品分类失败:', error)
                }
            },

            async fetchCategoryAttributes(sel) { // 获取分类下的参数或属性 sel为动态和静态
                if (!this.form.goods_cat.length) return
                try {
                    const categoryId = this.form.goods_cat[this.form.goods_cat.length - 1] // 分类id
                    const res = await GetcategoriestabHandle(categoryId, { sel })

                    if (sel === 'many') {
                        this.manyAttrs = this.processManyAttributes(res)
                    } else {
                        this.onlyAttrs = res
                    }
                } catch (error) {
                    console.error(`获取${sel === 'many' ? '商品参数' : '商品属性'}失败:`, error)
                }
            },

            processManyAttributes(data) { // 字符串转换为数组
                return data.map((item) => {
                    let attrVals = item.attr_vals.split(',')
                    if (attrVals[0] === '') {
                        attrVals.splice(0, 1)
                    }
                    return {
                        ...item,
                        attr_vals: attrVals.map((val) => ({
                            value: val,
                            checked: false
                        }))
                    }
                })
            },

            processAttributes() { // 处理选中的商品参数
                return this.manyAttrs.flatMap((item) => {
                    return item.attr_vals
                        .filter((val) => val.checked) // 过滤选中的参数
                        .map((val) => ({ // 映射为对象
                            attr_id: item.attr_id,
                            attr_value: val.value
                        }))
                })
            },

            // 添加商品
            async submitGoods() {
                if (this.loading) return
                this.loading = true
                try {
                    const formData = {
                        ...this.form,
                        goods_cat: this.form.goods_cat.join(','),
                        attrs: this.processAttributes()
                    }
                    this.isEditMode ? await Putgoods(this.form.goods_id, formData) : await Postgoods(formData)
                    this.$router.push('/home/goods')
                } catch (error) {
                    console.error('添加商品失败:', error)
                } finally {
                    this.loading = false
                }
            },

            // 编辑模式下获取商品详情
            async fetchGoodsDetails() {
                try {
                    const res = await Getgoodsid(this.$route.query.id)
                    // 处理商品分类
                    res.goods_cat = res.goods_cat.split(',').map(item => Number(item))
                    // 处理商品参数
                    res.attrs = res.attrs.map(item => ({
                        attr_id: Number(item.attr_id),
                        attr_value: item.attr_value
                    }))
                    this.form = res
                } catch (error) {
                    console.error('获取商品详情失败:', error)
                }
            },

            // 设置选中属性
            setSelectedAttributes(attrs) {
                console.log(this.form.attrs);
                console.log(this.manyAttrs);
                attrs.forEach(attr => {
                    const attrItem = this.manyAttrs.find(item => item.attr_id === attr.attr_id)
                    if (attrItem) {
                        const valItem = attrItem.attr_vals.find(val => val.value === attr.attr_value)
                        if (valItem) {
                            valItem.checked = true
                        }
                    }
                })
            },

            // 表单处理方法
            handleCategoryChange() {
                this.manyAttrs = []
                this.onlyAttrs = []
            },

            // 验证基本信息
            validateBasicInfo() {
                const { goods_name, goods_price, goods_weight, goods_number, goods_cat } = this.form
                const requiredFields = [goods_name, goods_price, goods_weight, goods_number, goods_cat]

                if (!requiredFields.every(field => field && field.toString().trim())) {
                    this.$message.warning('请填写完整的基本信息')
                    return false
                }
                return true
            },

            // 验证商品参数
            validateParameters() {
                if (!this.manyAttrs.length) return true

                const hasUncheckedParameters = this.manyAttrs.some(item =>
                    item.attr_vals.length && !item.attr_vals.some(val => val.checked)
                )

                if (hasUncheckedParameters) {
                    this.$message.warning('请选择所有必需的商品参数')
                    return false
                }
                return true
            },

            // 验证商品属性
            validateAttributes() {
                if (!this.onlyAttrs.length) return true

                const hasEmptyAttributes = this.onlyAttrs.some(item =>
                    !item.attr_vals || !item.attr_vals.toString().trim()
                )

                if (hasEmptyAttributes) {
                    this.$message.warning('请填写所有商品属性')
                    return false
                }
                return true
            },

            // // 文件处理方法
            // handleFileRemove(file, fileList) {
            //     this.fileList = fileList
            //     this.form.pics = this.form.pics.filter(pic => pic.pic !== file.response?.data?.tmp_path)
            // },

            // handleFileChange(file, fileList) {
            //     this.fileList = fileList
            //     if (file.response && file.response.data) {
            //         const tmpPath = file.response.data.tmp_path
            //         if (!this.form.pics.some(pic => pic.pic === tmpPath)) {
            //             this.form.pics.push({ pic: tmpPath })
            //         }
            //     }
            // },

            // handleBeforeRemove(file) {
            //     return this.$confirm(`确定移除 ${file.name}？`)
            // },

            // 步骤切换方法
            async beforeStepLeave(activeName, oldActiveName) {
                const activeNum = parseInt(activeName)

                // 基本信息验证
                if (activeNum > 0 && !this.validateBasicInfo()) {
                    return false
                }

                // 商品参数验证
                if (activeNum > 1 && !this.validateParameters()) {
                    return false
                }

                // 商品属性验证
                if (activeNum > 2 && !this.validateAttributes()) {
                    return false
                }

                // 按需加载数据
                if (activeNum === 1 && !this.manyAttrs.length) {
                    await this.fetchCategoryAttributes('many')
                    if (this.isEditMode) this.setSelectedAttributes(this.form.attrs || [])
                }

                if (activeNum === 2 && !this.onlyAttrs.length) {
                    this.fetchCategoryAttributes('only')
                }

                // 提交商品
                if (activeNum === 6) {
                    this.submitGoods()
                    return false // 阻止tab切换，由提交成功后跳转
                }

                this.active = activeNum
                return true
            },
        },

        mounted() {
            // 编辑模式下获取商品详情
            if (this.isEditMode) this.fetchGoodsDetails()
            // 获取分类数据
            this.fetchCategories()
        }
    }
</script>
<template>
    <div id="add" style="height: 88%;">
        <el-alert title="添加商品" type="info" :closable="false" show-icon></el-alert>

        <el-steps style="margin: 20px 0;" :active="active" align-center finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <el-tabs tab-position="left" :before-leave="beforeStepLeave">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息">
                <el-form :rules="rules" ref="ruleForm" label-position="top" label-width="80px" :model="form">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader v-model="form.goods_cat" @change="handleCategoryChange" :options="options" :props="{
                            value: 'cat_id',
                            label: 'cat_name',
                            children: 'children'
                        }"></el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <!-- 商品参数 -->
            <el-tab-pane label="商品参数">
                <div v-if="manyAttrs.length">
                    <div v-for="item in manyAttrs" :key="item.attr_id">
                        <div>{{ item.attr_name }}</div>
                        <div>
                            <el-checkbox :name="item.attr_name" v-for="val in item.attr_vals" v-model="val.checked"
                                :label="val.value"></el-checkbox>
                        </div>
                    </div>
                </div>
                <div v-else>暂无商品参数，请先选择商品分类</div>
            </el-tab-pane>

            <!-- 商品属性 -->
            <el-tab-pane label="商品属性">
                <div v-if="onlyAttrs.length">
                    <el-form ref="attributesForm" label-position="top" label-width="80px">
                        <el-form-item :label="item.attr_name" v-for="item in onlyAttrs" :key="item.attr_id"
                            :rules="[{ required: true, message: `请输入${item.attr_name}`, trigger: 'blur' }]"
                            :prop="`attr_${item.attr_id}`">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-else>暂无商品属性，请先选择商品分类</div>
            </el-tab-pane>

            <!-- 商品图片 -->
            <el-tab-pane label="商品图片">
                <!-- <el-upload action="http://43.138.15.137:7000/api/private/v1/upload" :on-change="handleFileChange"
                    :on-remove="handleFileRemove" :before-remove="handleBeforeRemove" :file-list="fileList"
                    :headers="headers">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload> -->
                <el-upload action="http://43.138.15.137:7000/api/private/v1/upload" :headers="headers">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>

            <!-- 商品内容 -->
            <el-tab-pane label="商品内容">
                <quill-editor v-model="form.goods_introduce"></quill-editor>
                <div>
                    <el-button type="primary" @click="beforeStepLeave('6', '4')">
                        添加商品
                    </el-button>
                    <el-button @click="$router.push('/home/goods')">
                        取消
                    </el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>