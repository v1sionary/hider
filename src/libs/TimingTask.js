import { getType } from './utils';

export const PERIODS_MINUTES = {
  '15min': 15,
  '30min': 30,
  '1h': 60,
  '12h': 72,
};

export const MINUTES_PERIODS = Object.keys(PERIODS_MINUTES).reduce((map, key) => {
  map[PERIODS_MINUTES[key]] = key;
  return map;
}, {});

const def = {
  // regular / periodic
  type: 'regular',
  // hour / date / day /
  timeUnit: 'hour',
  timings: [8],
  period: PERIODS_MINUTES['1h'],
};
const EMPTY_VAL = void 0;

export default class TimingTask {
  constructor(props = {}) {
    const _type = props.type;

    if (!!Object.keys(props).length && !_type) {
      throw new Error('must provide task type!');
    }

    if (_type === 'regular') {
      Object.assign(this, {
        type: props.type,
        timeUnit: props.timeUnit || def.timeUnit,
        timings: props.timeUnit && props.timings && Array.isArray(props.timings) ? props.timings : def.timings,
        period: EMPTY_VAL,
      });
    }

    if (_type === 'periodic') {
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
  }

  getAlarmOpt() {
    if (this.type === 'regular') {
      return {
        delay: 1,
        period: 1,
      };
    }

    return {
      delay: 1,
    };
  }

  updateExcutedTime() {
    this.lastExcutedTime = new Date().getTime();
  }
}
