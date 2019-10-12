// rules: match & execute & schedule
let rule_id = 1;
const RULE_PROPERTIES = ['id', 'enabled', 'url', 'keyword', 'searchArea'];
const RULE_PROPERTIES_DEFAULT = {
  enabled: false,
  url: '',
  keyword: '',
  searchArea: 'ALL',
};

export default class Rule {
  constructor(opt = {}) {
    Object.assign(this, this.initProperties(opt));
  }

  initProperties(opt) {
    return RULE_PROPERTIES.reduce((props, p) => {
      if (p === 'id') {
        props['id'] = opt.id || `rule_id_${rule_id++}_${new Date().getTime()}`;
      } else {
        props[p] = opt[p] || RULE_PROPERTIES_DEFAULT[p];
      }
      return props;
    }, Object.create(null));
  }

  getProperties(rule = this) {
    return Object.keys(rule)
      .filter(key => RULE_PROPERTIES.includes(key))
      .reduce((res, key) => {
        res[key] = rule[key];
        return res;
      }, Object.create(null));
  }

  getExcutedRule() {
    if (this.url)
      return {
        type: 'url',
        url: this.url,
      };

    if (this.keyword)
      return {
        type: 'keyword',
        keyword: this.keyword,
        searchArea: this.searchArea,
      };

    return {};
  }
}
