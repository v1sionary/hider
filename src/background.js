const browser = (global.browser = require('webextension-polyfill'));

import Store from './libs/store';
import { sweepByRuleList, sweepByRule } from './libs/sweeper';
import { clearUnmatchAlarms, deleteAlarmByName, clearAllAlarms } from './libs/scheduler';

const store = new Store();
window.$store = store;

browser.windows.onCreated.addListener(() => {
  // find & remove history which are match the keyword
  // when open a browser
  setTimeout(() => {
    store.getRules().then(rules => {
      const _enabledRules = [];
      const ruleids = [];
      rules.forEach(rule => {
        ruleids.push(rule.id);
        if (rule.enabled === true) _enabledRules.push(rule);
      });
      console.log('start sweeping...');
      sweepByRuleList(_enabledRules).then(() => {
        _enabledRules.forEach(rule => {
          const _task = rule.timingTask;
          _task.updateExcutedTime();
          store.saveRule(rule, true);
        });
      });
      if (!ruleids.length) {
        clearAllAlarms();
      } else {
        clearUnmatchAlarms(ruleids).then(count => console.log('clear unmatch alarms: ', count));
      }
    });
  }, 1000);
});

const getRuleId = alarmName => {
  const prefix = 'ALARM_';
  return ('' + alarmName).slice(prefix.length);
};

// find & remove history which are match the rules
// on the regular time
browser.alarms.onAlarm.addListener(alarm => {
  const _ruleId = getRuleId(alarm.name);

  if (!_ruleId) return deleteAlarmByName(alarm.name);

  store.getRuleByID(_ruleId).then(rule => {
    if (!rule || !rule.ticking) return deleteAlarmByName(alarm.name);

    sweepByRule(rule)
      .then(removedCount => {
        console.log('removed count: ', removedCount);

        const _task = rule.timingTask;

        _task.updateExcutedTime();
        _task.updateNextExcutedTime();
        store.saveRule(rule, true);

        if ((rule.timingTask.type = 'regular')) {
          const alarmOpt = Object.assign({ ruleId: rule.id }, _task.getAlarmOpt());
          createAlarm(alarmOpt);
        }
      })
      .catch(() => {
        deleteAlarmByName(alarm.name);
      });
  });
});
