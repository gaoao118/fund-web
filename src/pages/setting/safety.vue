<script setup lang="ts">
import router from "@/router";
import {getUserSafety, inviterBinding} from "@/api/csUser";
import {showSuccessToast} from "vant";
import {updatePassword} from "@/api/csAuth";
import {Encrypt} from "@/utils/secret";
import {getUserId} from "@/utils/auth";

const info = ref({});
const showPwd = ref(false);
const showInvite = ref(false);
const password = ref('');
const newPwd = ref('');
const newPwdTwo = ref('');
const inviteCode = ref('');

function bindingEmail() {
  if (info.value.email) {
    showSuccessToast('已绑定邮箱');
    return;
  }
  router.push({name: 'bindingEmail'})
}

function updatePwd() {
  if (!password.value) {
    showToast('请输入旧密码');
    return;
  }
  if (!newPwd.value) {
    showToast('请输入新密码');
    return;
  }
  if (!newPwdTwo.value) {
    showToast('请再次输入新密码');
    return;
  }
  if (newPwd.value !== newPwdTwo.value) {
    showToast('二次密码输入不一致');
    return;
  }
  let userId = getUserId();
  let encrypt = Encrypt(password.value, userId);
  let newEncrypt = Encrypt(newPwd.value, userId);
  updatePassword(encrypt, newEncrypt).then(res => {
    if (res.code === 200) {
      showSuccessToast('修改成功');
      cancelPwd();
    }
  })
}

function cancelPwd() {
  showPwd.value = false
  password.value = ''
  newPwd.value = ''
  newPwdTwo.value = ''
}

function bindingInviter() {
  if (!inviteCode.value) {
    showToast('请输入邀请码');
    return;
  }
  inviterBinding(inviteCode.value).then(res => {
    if (res.code === 200) {
      showSuccessToast('绑定成功');
      cancelInviter();
      getConfigInfo();
    }
  })
}

function cancelInviter() {
  inviteCode.value = ''
}

function gotoPayPassword(num) {
  if (num === 2 && !info.value.email) {
    showToast('未绑定邮箱，请先绑定邮箱');
    return;
  }
  router.push({name: 'payPassword'})
}

function getConfigInfo() {
  getUserSafety().then(res => {
    if (res.code === 200) {
      info.value = res.data
    }
  })
}

onMounted(() => {
  getConfigInfo();
})

</script>

<template>
  <div class="main">
    <van-cell @click="bindingEmail" title="绑定邮箱" :value="info.email ? info.email : '未绑定'" is-link/>
    <van-cell @click="showPwd = true" class="mt-8px" title="修改登录密码" is-link/>
    <van-cell v-if="!info.password" @click="gotoPayPassword(1)" class="mt-8px" title="设置支付密码" is-link/>
    <van-cell v-else @click="gotoPayPassword(2)" title="修改支付密码" class="mt-8px" is-link/>
    <van-cell v-if="!info.accId" @click="showInvite = true" class="mt-8px" title="绑定邀请码" value="未绑定" is-link/>
    <van-cell v-else class="mt-8px" title="绑定邀请码" value="已绑定" is-link/>
    <div style="text-align: center" class=" mt-50px">
      <van-button style="width: 85vw; height: 45px" round type="danger">注销账号</van-button>
    </div>

    <van-dialog @confirm="updatePwd" @close="cancelPwd" v-model:show="showPwd" title="修改登录密码" show-cancel-button>
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="password"
            placeholder="请输入旧登录密码"
          />
          <van-field
            v-model="newPwd"
            type="password"
            placeholder="请输入新登录密码"
          />
          <van-field
            v-model="newPwdTwo"
            type="password"
            placeholder="请输入再次输入新登录密码"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>

    <van-dialog @confirm="bindingInviter" @close="cancelInviter" v-model:show="showInvite" title="绑定邀请码"
                show-cancel-button>
      <van-form>
        <van-cell-group inset>
          <van-field
            style="font-size: 16px"
            v-model="inviteCode"
            placeholder="请输入邀请码"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>
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
"name": "safety",
"meta": {
"title": "账户安全"
}
}
</route>