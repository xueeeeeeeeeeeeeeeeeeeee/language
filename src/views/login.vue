<template>
  <div class="logindiv">
    <div class="logindiv-header">汉语教学小程序&nbsp;教师后台</div>
    <div class="logindiv-loginbody">
      <div class="loginbody-title">登录</div>
      <div class="loginbody-content">
        <div class="loginbody-logintip">输入你的账号和密码进行登陆</div>
      </div>
      <div class="formitem">
            <input type="text" required v-model="name" /><span>用户名</span>
          </div>
          <div class="formitem">
            <input type="password" required v-model="password" /><span
              >密码</span
            >
          </div>
      <a-button type="primary" class="loginbody-button" @click="login">登陆</a-button>
      <view class="reginster">没有账号？<a href="">即刻注册</a></view>
    </div>
  </div>
</template>

<script>

// const serveitems =;
export default {
  data() {
    return {
    };
  },

  methods: {
    login(){
        console.log(1);
    }
  },
};
</script>
<style>
.logindiv {
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logindiv-header {
  width: 100%;
  height: 4em;
  background: #fff;
  font-size: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
  position: fixed;
  top: 0;
  border-bottom: #ccc solid 1px;
}
.logindiv-loginbody {
  width: 40%;
  /* background-color: #fff; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
}
.formitem {
  position: relative;
  width: 100%;
  margin-top: 20px;
}
.formitem input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  outline: none;
}
.formitem span {
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px;
  font-size: 1em;
  pointer-events: none;
  color: #ccc;
  font-weight: normal;
  transition: all 0.5s;
}
.formitem input:valid ~ span,
.formitem input:focus ~ span {
  color: orange;
  transform: translateX(10px) translateY(-7px);
  font-size: 0.65em;
  padding: 0 10px;
  background-color: #fff;
}
.loginbody-title {
  font-size: 30px;
  font-weight: 700;
}
.loginbody-button{
    width: 100%;
    height: 3em;
}
.loginbody-logintip{
    color: #a0a1a0;
}
.reginster{
color:  #8c8c9b;
}
.reginster a{
    text-decoration: dashed;
    color: #000;
    font-weight: 900;
}
</style>
