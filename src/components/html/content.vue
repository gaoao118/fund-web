<script setup lang="ts">
import {toRefs} from 'vue'

const props = defineProps({
  //子组件接收父组件传递过来的值
  info: String,
})
//使用父组件传递过来的值
const {info} = toRefs(props)
function format(html: string) {
  if (html) {
    let replace = html.replace("font-size: 1.7rem", "font-size: 1rem");
    return replace;
  } else {
    return '';
  }
}

</script>

<template>
  <!-- 不需要添加额外的样式 -->
  <div v-richText="format(info)"></div>
</template>

<style scoped lang="less">

</style>