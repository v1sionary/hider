// rules: match & execute & schedule
let rule_id = 1;

export default class Rule {
  constructor(opt) {
    const uid = `rule_id_${rule_id++}_${new Date().getTime()}`;

    Object.assign(this, {
      id: opt.id || uid,
      enabled: opt.enabled || false,
      url: opt.url || '',
      keyword: opt.keyword || '',
    });
  }
}
