import md5 from 'md5';

const browser = require('webextension-polyfill');

const PASSWORD_STORE_KEY = 'HIDER_PWD';
const HIDER_SALT = 'XX_SO_CUTE';

let _isVerified = false;

export function isVerified() {
  return _isVerified;
}

export function setPassword(password) {
  if (!isPasswordVaild(password)) return Promise.reject('password must be contain at least 6');

  const encryptedPassword = encrypt(password);
  return browser.storage.local.set({ [PASSWORD_STORE_KEY]: encryptedPassword }).then(() => {
    return true;
  });
}

export function isPasswordVaild(pwd) {
  return !!pwd && ('' + pwd).length >= 6;
}

export function verifyPassword(password) {
  const encryptedPassword = encrypt(password);

  return getStorePassword().then(storedPassword => {
    if (!storedPassword) return Promise.reject('no password been set');
    const _isEqual = storedPassword === encryptedPassword;
    if (_isEqual) _isVerified = true;
    return _isEqual;
  });
}

function encrypt(pwd) {
  pwd = '' + pwd;
  const l = pwd.length;

  const firstChar = pwd[0];
  const lastChar = pwd[l - 1];
  const firstCharCode = firstChar.charCodeAt();

  const salt = `${firstChar} - ${lastChar} - ${firstCharCode} ${HIDER_SALT}`;

  return md5(salt + pwd);
}

function getStorePassword() {
  return browser.storage.local.get(PASSWORD_STORE_KEY).then(res => {
    return res[PASSWORD_STORE_KEY];
  });
}
