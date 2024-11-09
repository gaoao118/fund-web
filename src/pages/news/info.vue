<script setup lang="ts">
import {getNewsInfo} from "@/api";
import {useRoute} from "vue-router";
import router from "@/router";


const info = ref('');
const title = ref('');

function retreat() {
  router.back()
}

function newsInfo(id) {
  getNewsInfo(id).then(res => {
    if (res.code === 200) {
      info.value = res.data.content
      title.value = res.data.title
    }
  })
}

onMounted(()=>{
  let route = useRoute();
  newsInfo(route.query.id)
});

</script>

<template>
  <div class="main">
    <div class="flex justify-between items-center">
      <van-icon style="font-size: 23px; margin-left: -5px" @click="retreat" name="arrow-left"/>
      <div style="font-weight: 500; margin-right: 10px; width: 90vw; font-size: 12px !important;">
        <van-notice-bar background="transparent" color="black" :text="title"/>
      </div>
      <div></div>
    </div>

    <div>
      <content :info="info" />
    </div>

  </div>
</template>

<style scoped lang="less">
.main {
  width: 100vw;
  height: 100vh;
  background: url("/bj-user.png") no-repeat 100%;
  background-size: cover;
  padding: 12px;
}

</style>

<route lang="json">
{
"name": "newsInfo"
}
</route>