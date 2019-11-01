import { getType } from './utils';

export const PERIODS_MILLSECOND = {
  '15min': 900000,
  '30min': 1800000,
  '1h': 3600000,
  '12h': 43200000,
};

export const MILLSECOND_PERIODS = Object.keys(PERIODS_MILLSECOND).reduce((map, key) => {
  map[PERIODS_MILLSECOND[key]] = key;
  return map;
}, {});

const def = {
  // regular / periodic
  type: 'regular',
  // hour / date / day /
  timeUnit: 'hour',
  timings: [8],
  period: PERIODS_MILLSECOND['1h'],
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
        period: getType(_p) === 'Number' ? _p : PERIODS_MILLSECOND[_p],
      });
    }

    if (!props.createdTime) {
      this.createdTime = new Date().getTime();
    }

    if (!props.lastExcutedTime) {
      this.lastExcutedTime = EMPTY_VAL;
    }
  }
}
