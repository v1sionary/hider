const browser = require('webextension-polyfill');

/**
 * create a alarm
 * overwrite if existed
 * @param {Object} opt options for create alarm
 * @param {String} opt.ruleId Rule id
 * @param {Date} [opt.when] fire timing
 * @param {Number} [opt.delay] delay time as minutes
 * @param {Number} [opt.period] period as minutes
 * @returns {Promise<boolean>} wasCreated promise
 */
export function createAlarm(opt = {}) {
  if (!opt.ruleId) throw new Error('must provide Rule id');
  if (!opt.when && !opt.delay) throw new Error('must provide when or delay option');

  return new Promise(resolve => {
    browser.alarms.create(nameAlarmName(opt.ruleId), {
      when: opt.when,
      delayInMinutes: opt.delay,
      periodInMinutes: opt.period,
    });
    resolve(true);
  });
}

/**
 * get alarm by Rule id
 * @param {String} ruleid  Rule id
 * @returns {Promise<Alarm>} Promise with Alarm
 */
export function getAlarm(ruleid) {
  const _name = nameAlarmName(ruleid);
  return browser.alarms.get(_name);
}

/**
 * get alarm list
 * @returns {Promise<Alarm[]>} Promise with Alarm list
 */
export function getAlarmList() {
  return browser.alarms.getAll();
}

/**
 * delete alarm by Rule id
 * @param {String} ruleid Rule id
 * @returns {Promise<boolean>} wasClear Promise
 */
export function deleteAlarm(ruleid) {
  const _name = nameAlarmName(ruleid);
  return browser.alarms.clear(_name);
}

/**
 * delete alarm by Alarm name
 * @param {String} name alarm name
 * @returns {Promise<boolean>} wasClear Promise
 */
export function deleteAlarmByName(name) {
  return browser.alarms.clear(name);
}

/**
 * delete all unmatch Alarms
 * @param {String[]} ruleIds existed Rule ids
 * @returns {Promise<Number>} a Promise with deleted count
 */
export function clearUnmatchAlarms(ruleIds) {
  if (!ruleIds || !Array.isArray(ruleIds)) throw new Error('must provide Rule id list');
  if (!ruleIds.length) return Promise.resolve(0);

  const keepAlarmNames = ruleIds.map(id => nameAlarmName(id));

  return getAlarmList()
    .then(alarms => {
      return alarms.map(alarm => alarm.name).filter(name => !keepAlarmNames.includes(name));
    })
    .then(unmatchAlarmNames => {
      const promises = [];
      unmatchAlarmNames.forEach(name => {
        promises.push(browser.alarms.clear(name));
      });
      return Promise.all(promises);
    })
    .then(promises => promises.length);
}

/**
 * clear all alarms
 * @returns {Promise<boolean>} wasClear Promise
 */
export function clearAllAlarms() {
  return browser.alarms.clearAll();
}

/**
 * give a alarm name
 * @param {String} ruleid rule id
 * @returns {String} alarm name
 */
function nameAlarmName(ruleid) {
  return `ALARM_${ruleid}`;
}
