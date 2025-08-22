<template>
  <div>
    <!-- 如果有子菜单，渲染为 submenu -->
    <el-submenu v-if="menu.children && menu.children.length > 0"
      :index="String('/home/' + menu.path)"
      :key="menu.id">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{ menu.authName }}</span>
      </template>

      <!-- 递归渲染子菜单 -->
      <menu-item v-for="(child, childIndex) in menu.children"
        :key="child.id"
        :menu="child"
        :index="child.path">
      </menu-item>
    </el-submenu>

    <!-- 如果没有子菜单，渲染为普通菜单项 -->
    <el-menu-item v-else
      :index="String('/home/' + menu.path)"
      :key="menu.id">
      <i class="el-icon-document"></i>
      <span>{{ menu.authName }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
}
</script>

<style lang="scss">
.el-submenu,
.el-menu {
  background-color: #4083cd;

  i,
  span {
    color: #fff;
  }
}

.el-menu-item:hover,
.el-submenu__title:hover,
.el-menu-item.is-active {
  background-color: #5a9fd8 !important;
  color: #fff;
}
</style>
