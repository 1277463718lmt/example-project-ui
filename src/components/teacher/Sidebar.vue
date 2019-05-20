<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" :collapse="collapse" unique-opened router>
      <template v-for="(item, index) in items">
          <el-menu-item :index="item.to" :key="index">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from './bus'
  export default {
    data() {
      return {
        collapse: false,
        items: [
			{
				icon: 'my-iconfont my-iconzhanghaoguanli_1',
				title: '修改个人信息',
				to:'/teacher/info'
			},
			{
				icon: 'my-iconfont my-iconxuesheng_1',
				title: '我的学生',
				to:'/teacher/mystudent'
			},
			{
				icon: 'my-iconfont my-iconsuoyourenyuan_1',
				title: '选择学生',
				to:'/teacher/changestudent'				
			},
			{
				icon: 'my-iconfont my-iconchuangjian3',
				title: '参考题目创建',
				to:'/teacher/creategp'
			},
			{
				icon: 'my-iconfont my-iconshenpi_1',
				title: '文件审批',
				to:'/teacher/filewatch'
			},
			{
				icon: 'my-iconfont my-icontimuliebiao_1',
				title: '历年题目',
				to:'/teacher/allgp'
			},
        ]
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '')
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg
      })
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar {
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }
  .sidebar > ul {
    height: 100%;
  }
</style>
