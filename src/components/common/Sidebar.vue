<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" :collapse="collapse" unique-opened router>
      <template v-for="(item, index) in items">
          <el-submenu :index="String(index)" :key="index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="(subItem, index) in item.subs">
                <el-menu-item :index="subItem.to" :key="index" :class="subItem.icon">
                  {{subItem.title}}
                </el-menu-item>
            </template>
          </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus'
  export default {
    data() {
      return {
        collapse: false,
        items: [
          {
            icon: 'my-iconfont my-iconxuesheng',
            title: '学生管理',
            subs: [
              { icon: 'my-iconfont my-iconzhanghaoguanli', title: '学生账号管理', to: '/admin/student'},
              { icon: 'my-iconfont my-iconzhanghaoxinxiguanli', title: '学生信息管理', to: '/admin/studentinfo'},
			  { icon: 'my-iconfont my-iconshangchuanguanli', title: '学生上传记录', to: '/admin/uploadfile'},
			  { icon: 'my-iconfont my-iconshejiguanli', title: '学生毕业设计', to: '/admin/studentgp'}
            ]
          },
          {
            icon: 'my-iconfont my-iconjiaoshi',
            title: '教师管理',
            subs: [
              { icon: 'my-iconfont my-iconzhanghaoguanli', title: '教师账号管理', to: '/admin/teacher'},
              { icon: 'my-iconfont my-iconzhanghaoxinxiguanli', title: '教师信息管理', to: '/admin/teacherinfo'},
              { icon: 'my-iconfont my-iconhuxiangguanzhu', title: '教师互查设置', to: '/admin/mutual'}
            ]
          },
          {
            icon: 'my-iconfont my-iconshejiguanli',
            title: '毕设题目管理',
            subs: [
              { icon: 'my-iconfont my-iconshenpi', title: '选题审核', to: '/admin/gp_title'},
              { icon: 'my-iconfont my-icontimuliebiao', title: '历年毕设题目', to: '/admin/allgp'}
            ]
          },
          {
            icon: 'my-iconfont my-iconxitongtongzhi-xitonggonggao',
            title: '通知系统',
             subs: [
              { icon: 'my-iconfont my-iconmoban', title: '模板管理', to: '/admin/mould' },
              { icon: 'my-iconfont my-iconsuoyourenyuan', title: '全体通知', to: '/admin/allmail' },
              { icon: 'my-iconfont my-iconyoujian', title: '教师通知', to: '/admin/teachermail' },
              { icon: 'my-iconfont my-iconyoujian', title: '学生通知', to: '/admin/studentmail' } 
            ]
		  },
		  {
			icon: 'my-iconfont my-iconshangchuanguanli',
			title: '文件管理',
			subs: [
				{ icon: 'my-iconfont my-iconshangchuanguanli' , title:'文件模板管理' , to: '/admin/filemould'}
			]
		  },
		  {
			 icon: 'my-iconfont my-iconxitong',
			 title: '系统设置',
			 subs: [
				{ icon: 'my-iconfont my-iconshijian' ,title: '毕业设计日程安排', to:'/admin/gptime' },
				{ icon: 'my-iconfont my-iconxitong1' ,title: '设置', to: '/admin/403' }
			 ]
		  }
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
