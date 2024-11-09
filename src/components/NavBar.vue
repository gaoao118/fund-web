<script setup lang="ts">
const route = useRoute()
const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const { t } = useI18n()

const title = computed(() => {
  if (!route.meta)
    return ''

  return route.meta.i18n ? t(route.meta.i18n) : (route.meta.title || '')
})

const routeWhiteList = [ 'profile']
const routeCloseList = ['home', 'funds', 'news', 'user', 'login', 'register', 'forget', 'fundInfo', 'wallet',
  'invest', 'newsInfo', 'userRecord', 'userRecordInfo', 'manager', 'invite', 'inviteMember']

const showLeftArrow = computed(() => routeWhiteList.includes(route.name))
const closeArrow = computed(() => routeCloseList.includes(route.name))
</script>

<template>
  <VanNavBar
    :title="title"
    :fixed="true"
    v-if="!closeArrow"
    clickable
    placeholder
    :left-arrow="!showLeftArrow"
    @click-left="onBack"
  />
</template>
<style scoped lang="less">
//样式穿透
:deep(.van-nav-bar .van-icon) {
  color: #000000;
  font-size: 18px;
}
</style>



