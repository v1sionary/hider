const def = {
  // regular / periodic
  type: 'regular',
  // hour / date / day /
  timeUnit: 'hour',
  timing: [8],
  period: void 0,
};

export default class TimingTask {
  constructor(props) {
    if (!!Object.keys(props).length && !props.type) {
      throw new Error('must provide task type!');
    }
    Object.assign(this, { type: props.type || def });
  }
}
