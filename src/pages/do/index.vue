<script setup lang="ts">
import {locale} from "@/utils/i18n";

const url = ref('https://etfas.com/')

onMounted(() => {
  if (locale.value) {
    if (locale.value === 'en-US') {
      return;
    }
    if (locale.value === 'zh-TW') {
      url.value = url.value + locale.value + ".html";
      return;
    }
    url.value = url.value + locale.value.substring(0, 2) + ".html";
  }
});
</script>

<template>
  <div class="main">
    <iframe style="height:  calc(100vh - 52px); width: 100vw;" scrolling="no" frameborder="no" :src="url">
    </iframe>
  </div>
</template>

<style scoped lang="less">
.main {
  overflow: hidden;
}
</style>

<route lang="json">
{
"name": "do"
}
</route>