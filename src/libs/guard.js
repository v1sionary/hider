import md5 from 'md5';

const browser = require('webextension-polyfill');

const PASSWORD_STORE_KEY = 'HIDER_PWD';
const IS_ON_DUTY_KEY = 'HIDER_GUARDING';
const HIDER_SALT = 'XX_SO_CUTE';

let _isVerified = false;
let _isGuarding = true;

export function initGuard() {
  return getGuarding()
    .then(isGuaring => {
      if (!isGuaring) {
        _isGuarding = false;
        return _isGuarding;
      }
      return getStorePassword();
    })
    .then(res => {
      // set verified flag while no guard or no password
      if (!res) {
        _isVerified = true;
      } else {
        // read verified status from session
        _isVerified = sessionStorage.getItem('isVerified') === 'true';
      }
      return true;
    });
}

export function setGuarding(isGuaring = false) {
  _isGuarding = !!isGuaring;
  return browser.storage.local.set({ [IS_ON_DUTY_KEY]: _isGuarding });
}

export function getGuarding() {
  return browser.storage.local.get(IS_ON_DUTY_KEY).then(res => {
    return res[IS_ON_DUTY_KEY];
  });
}

export function isAuth() {
  return !_isGuarding || _isVerified;
}

export function getGuardingInfo() {
  return getStorePassword().then(password => {
    return {
      enabled: _isGuarding,
      password: !!password,
    };
  });
}

export function isPasswordVaild(pwd) {
  return !!pwd && ('' + pwd).length >= 6;
}

export function setPassword(password) {
  if (!isPasswordVaild(password)) return Promise.reject('password must be contain at least 6');

  const encryptedPassword = encrypt(password);
  return browser.storage.local.set({ [PASSWORD_STORE_KEY]: encryptedPassword }).then(() => {
    return true;
  });
}

export function verifyPassword(password) {
  const encryptedPassword = encrypt(password);

  return getStorePassword().then(storedPassword => {
    if (!storedPassword) return Promise.reject('no password been set');
    const _isEqual = storedPassword === encryptedPassword;
    if (_isEqual) _isVerified = true;
    sessionStorage.setItem('isVerified', _isVerified);
    return _isEqual;
  });
}

export function resetPassword() {
  return browser.storage.local.remove([PASSWORD_STORE_KEY]);
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
