export const PERIODS_MILLSECOND = {
  '15min': 900000,
  '30min': 1800000,
  '1h': 3600000,
  '12h': 43200000,
};

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
      Object.assign(this, {
        type: props.type,
        timeUnit: EMPTY_VAL,
        timings: EMPTY_VAL,
        period: props.period || def.period,
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
