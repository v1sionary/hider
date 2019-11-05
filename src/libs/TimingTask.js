import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { getType } from './utils';

dayjs.locale('zh-cn');

window.dayjs = dayjs;

const PERIODS_MINUTES = {
  '15min': 15,
  '30min': 30,
  '1h': 60,
  '12h': 72,
};

const MINUTES_PERIODS = Object.keys(PERIODS_MINUTES).reduce((map, key) => {
  map[PERIODS_MINUTES[key]] = key;
  return map;
}, {});

const [T_REGULAR, T_PERIODIC] = ['regular', 'periodic'];

const EMPTY_VAL = void 0;
const def = {
  // regular / periodic
  type: T_REGULAR,
  // hour / date / day /
  timeUnit: 'hour',
  timings: [8],
  // next fire time
  nextExcuteTime: EMPTY_VAL,
  period: PERIODS_MINUTES['1h'],
};

/**
 * set zero value from a date
 * @param {Date} [date=new Date()]
 * @returns {Date} date with 00:00:00
 */
const setZero = (date = new Date(), unit = ['hour', 'minute', 'second']) => {
  let _d = dayjs.isDayjs(date) ? date : dayjs(date);
  if (!_d.isValid()) throw new Error('invaild Date');

  // set given unit to zero
  unit.forEach(u => {
    _d = _d.set(u, 0);
  });

  return _d;
};

export { PERIODS_MINUTES, MINUTES_PERIODS };

export default class TimingTask {
  constructor(props = {}) {
    const _type = props.type;

    if (!!Object.keys(props).length && !_type) {
      throw new Error('must provide task type!');
    }

    if (_type === T_REGULAR) {
      Object.assign(this, {
        type: props.type,
        timeUnit: props.timeUnit || def.timeUnit,
        timings: props.timeUnit && props.timings && Array.isArray(props.timings) ? props.timings : def.timings,
        period: EMPTY_VAL,
      });
    }

    if (_type === T_PERIODIC) {
      const _p = props.period || def.period;
      Object.assign(this, {
        type: props.type,
        timeUnit: EMPTY_VAL,
        timings: EMPTY_VAL,
        period: getType(_p) === 'Number' ? _p : PERIODS_MINUTES[_p],
      });
    }

    this.createdTime = props.createdTime || new Date().getTime();
    this.lastExcutedTime = props.lastExcutedTime || EMPTY_VAL;
    this.nextExcuteTime = props.nextExcuteTime || EMPTY_VAL;
  }

  getAlarmOpt() {
    if (this.type === T_REGULAR) {
      return {
        when: this.getNextExcuteTime(),
      };
    }

    if (this.type === T_PERIODIC) {
      return {
        delay: 1,
        period: this.period,
      };
    }

    return {
      delay: 1,
    };
  }

  getNextExcuteTimings(base = new Date().getTime()) {
    const _unit = this.timeUnit;
    const shouldSetZeroUnit = _unit === 'hour' ? ['minute', 'second'] : ['hour', 'minute', 'second'];
    return this.timings.map(t => {
      const _next = dayjs(base).set(_unit, t);
      return setZero(_next, shouldSetZeroUnit).valueOf();
    });
  }

  getNextExcuteTime() {
    const _baseTime = this.lastExcutedTime || this.createdTime;
    const _now = new Date().getTime();
    let _nextExcuteTime;

    const nextRoundUnit = {
      hour: 'day',
      day: 'week',
      date: 'month',
    };

    if (this.type === T_REGULAR) {
      const _nextExcuteTimes = this.getNextExcuteTimings();
      _nextExcuteTime = _nextExcuteTimes.sort().find(next => next > _now);

      if (!_nextExcuteTime) {
        const _nextRound = dayjs(_now).add(1, nextRoundUnit[this.timeUnit]);
        const _nextExcuteTimes = this.getNextExcuteTimings(_nextRound);
        _nextExcuteTime = _nextExcuteTimes.sort().find(next => next > _now);
      }

      return _nextExcuteTime;
    }

    if (this.type === T_PERIODIC) {
      // period in minutes
      return _baseTime + this.period * 60 * 1000;
    }
  }

  updateExcutedTime() {
    this.lastExcutedTime = new Date().getTime();
  }

  updateNextExcutedTime() {
    this.nextExcuteTime = this.getNextExcuteTime();
  }
}
