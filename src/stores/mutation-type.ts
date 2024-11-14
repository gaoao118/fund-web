export const STORAGE_TOKEN_KEY = 'access_token'
export const STORAGE_USER_ID = 'user_id'
export const STORAGE_LANG_KEY = 'app_lang'
export const USER_INVITE_CODE = 'user_invite_code'
export const OFFICIAL_WEBSITE = 'https://etfas.com'
export const BACK_URL = 'https://api.etfns.com'

export function langFormat(lang: string) {
  if (lang === 'zh-TW') {
    return lang;
  }
  return lang.substring(0, 2);
}
