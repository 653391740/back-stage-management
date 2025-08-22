<template>
    <div class="search">
        <el-input placeholder="请输入内容" v-model="localQuery" class="input-with-select" @keyup.enter.native="Getgoods">
            <el-button slot="append" icon="el-icon-search" @click="Getgoods"></el-button>
        </el-input>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                localQuery: ''
            }
        },
        watch: {
            localQuery(newVal, oldVal) {
                if (newVal === '') {
                    this.Getgoods()
                }
            }
        },

        methods: {
            Getgoods() {
                this.$emit('search', this.localQuery)
            }
        }
    }
</script>
<style scoped lang="scss">
    .search {
        width: 500px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .input-with-select {
            margin-right: 10px;
        }
    }
</style>
