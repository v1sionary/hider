// https://developer.chrome.com/apps/alarms
const browser = require('webextension-polyfill');

export function createTask(opt) {
  return browser.alarms.clearAll().then(() => {
    // browser.alarms.create(opt.name, {
    //   delayInMinutes: 1,
    //   periodInMinutes: 1,
    // });
    return true;
  });
}

export function deleteTask(id) {}

export function getTask(id) {}

export function getTaskList() {
  return browser.alarms.getAll();
}

export function clearAllTasks() {}
