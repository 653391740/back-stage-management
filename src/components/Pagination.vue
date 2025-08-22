<template>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageData.pagenum" :page-sizes="pageSizeOptions" :page-size="pageData.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
</template>
<script>
    export default {
        props: {
            total: {
                type: Number,
                default: 0
            },
            pageData: {
                type: Object,
                default: () => {
                    return {
                        pagenum: 1,
                        pagesize: 20,
                    }
                }
            },
            pageSizeOptions: {
                type: Array,
                default: () => {
                    return [20, 55, 100, 200]
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.$emit('size-change', val);
            },
            handleCurrentChange(val) {
                this.$emit('current-change', val);
            },
        }
    }
</script>
<style scoped lang="scss">
    .el-pagination {
        margin-top: 20px;
    }
</style>