const browser = (global.browser = require('webextension-polyfill'));

import Store from './libs/store';
import { sweepByRuleList, sweepByRule } from './libs/sweeper';
import { clearUnmatchAlarms, deleteAlarmByName } from './libs/scheduler';

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
      sweepByRuleList(_enabledRules);
      clearUnmatchAlarms(ruleids).then(count => console.log('clear unmatch alarms: ', count));
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

  if (!_ruleId) deleteAlarmByName(alarm.name);

  store.getRuleByID(_ruleId).then(rule => {
    if (!rule || !rule.ticking) deleteAlarmByName(alarm.name);

    sweepByRule(rule)
      .then(removedCount => {
        console.log('removed count', removedCount);
        rule.timingTask.updateExcutedTime();
        store.saveRule(rule);
      })
      .catch(() => {
        deleteAlarmByName(alarm.name);
      });
  });
});
