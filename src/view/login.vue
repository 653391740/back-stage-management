<template>
    <div class="login-container">
        <el-row>
            <el-col :span="11">
                <div class="left-panel">
                    <div class="logo-container">
                        <img src="/src/assets/Snipaste_2025-08-14_16-35-45.png" alt="系统Logo" class="logo-image">
                        <h1 class="system-title">电商后台管理系统</h1>
                    </div>
                    <div class="feature-list">
                        <div class="feature-item">
                            <i class="el-icon-s-marketing"></i>
                            <span>全面的商品管理</span>
                        </div>
                        <div class="feature-item">
                            <i class="el-icon-user-solid"></i>
                            <span>用户权限控制</span>
                        </div>
                        <div class="feature-item">
                            <i class="el-icon-s-data"></i>
                            <span>数据分析报表</span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="13">
                <div class="right-panel">
                    <div class="login-form-container">
                        <div class="form-header">
                            <h2>欢迎登录</h2>
                            <p>请输入您的账号密码</p>
                        </div>
                        <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="rules">
                            <el-form-item prop="username">
                                <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                                    prefix-icon="el-icon-lock" @keyup.enter.native="submitForm('loginForm')">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;" :loading="loading"
                                    @click="submitForm('loginForm')">
                                    {{ loading ? '登录中...' : '登录' }}
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <div class="form-footer">
                            <p>© 2023 电商后台管理系统 版权所有</p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { Postlogin } from '@/api/http.js'
    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
                },
                loading: false
            }
        },
        methods: {
            async postlogin() {
                this.loading = true;
                try {
                    const res = await Postlogin(this.loginForm)
                    localStorage.setItem('token', JSON.stringify(res.token))
                    this.$router.push('/home')
                } catch (error) {
                    console.error('登录错误:', error)
                } finally {
                    this.loading = false;
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.postlogin();
                    } else {
                        this.$message.error('请正确填写登录信息');
                        return false;
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .login-container {
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #4083cd 0%, #2c5282 100%);
    }

    .left-panel {
        height: 100vh;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        padding: 40px;

        .logo-container {
            text-align: center;
            margin-bottom: 60px;

            .logo-image {
                max-width: 80%;
                max-height: 150px;
                margin-bottom: 20px;
            }

            .system-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0;
            }
        }

        .feature-list {
            width: 100%;
            max-width: 300px;

            .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                font-size: 16px;

                i {
                    margin-right: 15px;
                    font-size: 20px;
                    color: rgba(255, 255, 255, 0.8);
                }

                span {
                    font-weight: 500;
                }
            }
        }
    }

    .right-panel {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);

        .login-form-container {
            width: 90%;
            max-width: 400px;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

            .form-header {
                text-align: center;
                margin-bottom: 30px;

                h2 {
                    margin: 0 0 10px 0;
                    font-size: 28px;
                    color: #4083cd;
                }

                p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
            }

            .login-form {
                .el-input {
                    .el-input__inner {
                        background-color: rgba(255, 255, 255, 0.8);
                        border: none;
                        border-bottom: 1px solid #dcdfe6;
                        border-radius: 0;
                        margin-bottom: 10px;

                        &:hover,
                        &:focus {
                            border-bottom-color: #4083cd;
                        }
                    }
                }
            }

            .form-footer {
                margin-top: 30px;
                text-align: center;

                p {
                    margin: 0;
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }

    .el-row {
        width: 100%;
        height: 100%;
        margin: 0 !important;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        height: 100%;
        border-radius: 0;
    }

    .grid-content {
        height: 100%;
        border-radius: 0;
    }
</style>