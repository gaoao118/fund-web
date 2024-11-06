<script setup lang="ts">

</script>

<template>
  <div class="main">
    <van-cell title="清理缓存" is-link/>
    <van-cell class="mt-8px" title="关于我们" is-link/>
    <div style="text-align: center" class=" mt-50px">
      <van-button style="width: 85vw; height: 45px" round type="primary" color="linear-gradient(-61deg, #4C93FF, #2964E6)" >邀请朋友</van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  padding: 8px 0;
  height: 94.3vh;
  background-color: #f2f2f2;
}

</style>

<route lang="json">
{
"name": "setting",
"meta": {
"title": "设置"
}
}
</route>