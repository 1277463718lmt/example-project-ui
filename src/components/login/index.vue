<template>
<div class="div-main">
    <div class="aside">
		<p class="p1">让</p>
		<p class="p2">&nbsp;&nbsp;技</p>
		<p class="p3" >&nbsp;&nbsp;&nbsp;&nbsp;术</p>
		<p class="p4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改</p>
		<p class="p5">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;变</p>
		<p class="p6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生</p>
		<p class="p7">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活</p>
    </div>
    <div class="head">
		<h1>高校毕业设计管理系统</h1>
    </div>
    <div class="login-border">
        <el-tabs v-model="activeName" :stretch="true">
          <br/>
          <el-tab-pane label="学 生" name="student">
            <student></student>
          </el-tab-pane>
          <el-tab-pane label="教 师" name="teacher">
            <teacher></teacher>
          </el-tab-pane>
          <el-tab-pane label="管 理 员" name="admin">
            <admin></admin>
          </el-tab-pane>
        </el-tabs>
  </div>
</div>
</template>
<script>
import student from './student'
import teacher from './teacher'
import admin from './admin'
export default {
  name: 'login',
  components: {
    student,
    teacher,
    admin
  },
  data () {
    return {
      activeName: 'student'
    }
  }
}
</script>
<style>
@keyframes mymove
{
  0%   {top:100px;}
  25%  {top:400px;}
  50%  {top:200px;}
  75%  {top:400px;}
  100% {top:100px;}
}

body{
  overflow: hidden;
}

.div-main{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/login.jpg");
  background-size: cover;
}
.aside{
  position: absolute;
  left: 0%;
  top: 15%;
  width: auto;
  text-align: center;
  font-size: 40px;
  color: #3080fe;
  font-family:"宋体";
  animation: mymove 10s infinite;
}
.head{
  position: absolute;
  top:10%;
  right: 4%;
  width: 100%;
  height: 10%;
  text-align: right;
  font-family:"宋体";
  font-size: 20px;
}
.login-border {
  position: absolute;
  right: 6%;
  top: 30%;
  width: 250px;
  height: 280px;
  padding: 20px 40px 20px 40px;
  background-color: rgba(242, 244, 247, 0.715);
  border-radius: 5px;
}
.login-submit {
  background-color: #3080fe;
  width: 100%;
  border-radius: 5px;
}
.register-submit {
  width: 100%;
  background: #3080fe;
  border-radius: 5px;
}
</style>
