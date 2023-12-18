<template>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  box-sizing: border-box;
  margin-top: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
html {
  width: 100vw;
  height: 100vh;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
