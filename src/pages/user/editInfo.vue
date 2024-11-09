<script setup lang="ts">
import logo from '~/images/logo.jpg'

import {showImagePreview, showSuccessToast} from "vant";
import {getUserInfo, updateUserInfo} from "@/api/csUser";
import {uploadFile} from "@/api";

const {t} = useI18n()

const loading = ref(false);
const userInfo = ref({});
const name = ref('');
const showName = ref(false);

const afterRead = (file) => {
  loading.value = true
  uploadFile(file.file).then(res => {
    if (res.code === 200) {
      let url = res.data;
      console.log(url)
      setUserInfo(url, null);
    }
    loading.value = false
  })
};

function avatarShow() {
  let img = userInfo.value.avatar ? userInfo.value.avatar : logo;
  console.log(img)
  showImagePreview([img]);
}

function getInfo() {
  getUserInfo().then(res => {
    if (res.code === 200) {
      userInfo.value = res.data
    }
  })
}

function updateNickName() {
  setUserInfo(null, name.value);
}

function cancelNickName() {
  name.value = ''
}

function setUserInfo(avatar, nickName) {
  updateUserInfo(avatar, nickName).then(res => {
    if (res.code === 200) {
      if (avatar) {
        userInfo.value.avatar = avatar
      }
      if (nickName) {
        userInfo.value.nickName = nickName
      }
      showSuccessToast(t('common.updateSuc'));
    }
  })
}

onMounted(() => {
  getInfo()
})
</script>

<template>
  <div class="main">
    <div class="avatar" @click="avatarShow">
      <van-image
        fit="cover"
        round
        width="130px"
        height="130px"
        :src="userInfo.avatar ? userInfo.avatar : logo"
      />
    </div>
    <van-cell :title="t('user.myAvatar')" is-link>
      <van-uploader :readonly="loading" :after-read="afterRead" :max-count="1">
        <van-loading style="position: relative; top: -5px" color="#1989fa" size="26" v-if="loading"/>
        <div v-else><span>{{ t('common.update') }}</span></div>
      </van-uploader>
    </van-cell>
    <van-cell :title="t('user.myNickName')" @click="showName = true" is-link>
      <span>{{ userInfo.nickName }}</span>
    </van-cell>

    <van-dialog @confirm="updateNickName" @close="cancelNickName" v-model:show="showName"
                :title="t('user.updateNickName')"
                show-cancel-button>
      <van-form>
        <van-cell-group inset>
          <van-field
            style="font-size: 16px"
            v-model="name"
            :placeholder="t('user.nickNameNot')"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>
  </div>
</template>

<style scoped lang="less">
.main {
  height: 94.3vh;
  background-color: #f2f2f2;

  .avatar {
    background-color: #FFFFFF;
    margin-bottom: 10px;
    text-align: center;
    padding: 10px;
  }
}

</style>

<route lang="json">
{
"name": "editInfo",
"meta": {
"title": "",
"i18n": "menus.editInfo"
}
}
</route>