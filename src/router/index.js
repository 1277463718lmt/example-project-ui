import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/index.vue'
import error404 from '@/components/error/404.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login,
            name: 'login'
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/404',
            component: error404,
            name: '404'
        },
        {
            path: '/admin',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { user: 'admin', requireAuth: true },
            children: [
                {
                    path: 'student',
                    component: resolve => require(['../components/page/student.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'studentinfo',
                    component: resolve => require(['../components/page/studentinfo.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'teacher',
                    component: resolve => require(['../components/page/teacher.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'uploadfile',
                    component: resolve => require(['../components/page/uploadfile.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'gp_title',
                    component: resolve => require(['../components/page/gp_title.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: '/admin/teacherinfo',
                    component: resolve => require(['../components/page/teacherinfo.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'studentgp',
                    component: resolve => require(['../components/page/studentgp.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'allgp',
                    component: resolve => require(['../components/page/allgp.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'mutual',
                    component: resolve => require(['../components/page/mutual.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'mould',
                    component: resolve => require(['../components/page/mould.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'gptime',
                    component: resolve => require(['../components/page/gptime.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: '403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'allmail',
                    component: resolve => require(['../components/page/allmail.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'studentmail',
                    component: resolve => require(['../components/page/studentmail.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'teachermail',
                    component: resolve => require(['../components/page/teachermail.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'filemould',
                    component: resolve => require(['../components/page/filemould.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                },
                {
                    path: 'changepsw',
                    component: resolve => require(['../components/page/changepsw.vue'], resolve),
                    meta: { user: 'admin', requireAuth: true }
                }
            ]
        },
        {
            path: '/student',
            component: resolve => require(['../components/student/Home.vue'], resolve),
            meta: { user: 'student', requireAuth: true },
            children: [
                { path: 'info', component: resolve => require(['../components/spage/studentinfo.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'mygp', component: resolve => require(['../components/spage/mygp.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'changegp', component: resolve => require(['../components/spage/changegp.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'upload', component: resolve => require(['../components/spage/uploadfile.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'allgp', component: resolve => require(['../components/spage/allgp.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'download', component: resolve => require(['../components/spage/downloadfile.vue'], resolve), meta: { user: 'student', requireAuth: true } },
                { path: 'changepsw', component: resolve => require(['../components/spage/changepsw.vue'], resolve), meta: { user: 'student', requireAuth: true } }
            ]
        },
        {
            path: '/teacher',
            component: resolve => require(['../components/teacher/Home.vue'], resolve),
            meta: { user: 'teacher', requireAuth: true },
            children: [
                { path: 'info', component: resolve => require(['../components/tpage/teacherinfo.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'mystudent', component: resolve => require(['../components/tpage/mystudent.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'changestudent', component: resolve => require(['../components/tpage/changestudent.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'creategp', component: resolve => require(['../components/tpage/creategp.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'filewatch', component: resolve => require(['../components/tpage/filewatch.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'allgp', component: resolve => require(['../components/tpage/allgp.vue'], resolve), meta: { user: 'teacher', requireAuth: true } },
                { path: 'changepsw', component: resolve => require(['../components/tpage/changepsw.vue'], resolve), meta: { user: 'teacher', requireAuth: true } }
            ]
        }
    ]
})
