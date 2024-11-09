<script setup lang="ts">
import router from "@/router";
import {getUserSafety, inviterBinding} from "@/api/csUser";
import {showSuccessToast} from "vant";
import {updatePassword} from "@/api/csAuth";
import {Encrypt} from "@/utils/secret";
import {getUserId} from "@/utils/auth";

const {t} = useI18n()

const info = ref({});
const showPwd = ref(false);
const showInvite = ref(false);
const password = ref('');
const newPwd = ref('');
const newPwdTwo = ref('');
const inviteCode = ref('');

function bindingEmail() {
  if (info.value.email) {
    showSuccessToast(t('common.boundEmail'));
    return;
  }
  router.push({name: 'bindingEmail'})
}

function updatePwd() {
  if (!password.value) {
    showToast(t('common.oldPwdNot'));
    return;
  }
  if (!newPwd.value) {
    showToast(t('user.newPwdNot'));
    return;
  }
  if (!newPwdTwo.value) {
    showToast(t('user.newPwdNotTwo'));
    return;
  }
  if (newPwd.value !== newPwdTwo.value) {
    showToast(t('user.newPwdTwoErr'));
    return;
  }
  let userId = getUserId();
  let encrypt = Encrypt(password.value, userId);
  let newEncrypt = Encrypt(newPwd.value, userId);
  updatePassword(encrypt, newEncrypt).then(res => {
    if (res.code === 200) {
      showSuccessToast(t('common.updateSuc'));
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
    showToast(t('user.inviteCodeNot'));
    return;
  }
  inviterBinding(inviteCode.value).then(res => {
    if (res.code === 200) {
      showSuccessToast(t('common.boundSuc'));
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
    showToast(t('common.boundEmailNot'));
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
    <van-cell @click="bindingEmail" :title="t('common.emailBound')"
              :value="info.email ? info.email : t('common.notBound')" is-link/>
    <van-cell @click="showPwd = true" class="mt-8px" :title="t('common.updatePwd')" is-link/>
    <van-cell v-if="!info.password" @click="gotoPayPassword(1)" class="mt-8px" :title="t('common.setPayPwd')" is-link/>
    <van-cell v-else @click="gotoPayPassword(2)" :title="t('common.updatePayPwd')" class="mt-8px" is-link/>
    <van-cell v-if="!info.accId" @click="showInvite = true" class="mt-8px" :title="t('common.boundInviteCode')"
              :value="t('common.notBound')" is-link/>
    <van-cell v-else class="mt-8px" :title="t('common.boundInviteCode')" :value="t('common.boundEnd')" is-link/>

    <div style="text-align: center" class=" mt-50px">
      <van-button style="width: 85vw; height: 45px" round type="danger">{{ t('common.closeAccount') }}</van-button>
    </div>

    <van-dialog @confirm="updatePwd" @close="cancelPwd" v-model:show="showPwd" :title="t('common.updatePwd')"
                show-cancel-button>
      <van-form>
        <van-cell-group inset>
          <van-field
            v-model="password"
            :placeholder="t('common.oldLogPwdNot')"
          />
          <van-field
            v-model="newPwd"
            type="password"
            :placeholder="t('common.newLogPwdNot')"
          />
          <van-field
            v-model="newPwdTwo"
            type="password"
            :placeholder="t('common.newLogPwdTowNot')"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>

    <van-dialog @confirm="bindingInviter" @close="cancelInviter" v-model:show="showInvite"
                :title="t('common.boundInviteCode')"
                show-cancel-button>
      <van-form>
        <van-cell-group inset>
          <van-field
            style="font-size: 16px"
            v-model="inviteCode"
            :placeholder="t('user.inviteCodeNot')"
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
"title": "",
"i18n": "menus.safety"
}
}
</route>