export const STORAGE_TOKEN_KEY = 'access_token'
export const STORAGE_USER_ID = 'user_id'
export const STORAGE_LANG_KEY = 'app_lang'
export const OFFICIAL_WEBSITE = 'https://etfas.com'

export function langFormat(lang: string) {
  if (lang === 'zh-TW') {
    return lang;
  }
  return lang.substring(0, 2);
}
