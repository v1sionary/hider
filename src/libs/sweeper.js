const browser = require('webextension-polyfill');

const doRemoved = true;

// new Date('1998-06-11 0:00:00').getTime()
const START_TIME = 897494400000;
const MAX_COUNT = 9999;

/**
 * search visit history
 * @param {Object} [opt={}]
 * @param {string} [opt.text=''] - keyword
 * @param {string} [opt.startTime=897494400000] - millisecond default:1998-06-11 0:00:00
 * @param {string} [opt.endTime = new Date().getTime()] millisecond
 * @param {string} [opt.maxResults=9999]
 * @param {string} [opt.area] - search area includes ALL/URL/TITLE
 */
function search(opt = {}) {
  const params = Object.assign({
    text: opt.text || '',
    startTime: opt.startTime || START_TIME,
    endTime: opt.endTime || new Date().getTime(),
    maxResults: opt.maxResults || MAX_COUNT,
  });

  return browser.history.search(params).then(visits => {
    if (!!opt.area && opt.area !== 'ALL') {
      const _search_key = opt.area === 'TITLE' ? 'title' : 'url';
      const _k = (params.text + '').toLowerCase();
      visits = visits.filter(visit => {
        const _v = (visit[_search_key] + '').toLowerCase();
        return _v.indexOf(_k) !== -1;
      });
    }
    return visits.map(visit => visit.url);
  });
}

function remove(urls) {
  return new Promise(resolve => {
    const urlLength = urls && urls.length;
    if (!urlLength) resolve(0);

    urls.forEach((url, index) => {
      browser.history.deleteUrl({ url }).then(() => {
        if (index === urlLength - 1) resolve(urlLength);
      });
    });
  });
}

function checkKeyword(key) {
  const _type = typeof key;
  if (_type === 'undefined' || key === null || key === '') {
    throw new Error(`should provide search keyword, now is ${key === '' ? 'empty string' : key}`);
  }
}

/**
 * remove visit item by keyword
 *
 * @param {string} key search keyword
 * @param {string} [opt.area='ALL'] - search area includes ALL/URL/TITLE
 * @return { Promise } removed count
 */
export function removeByKeyword(key, area = 'ALL') {
  checkKeyword(key);

  return search({ text: key, area }).then(urls => {
    console.log('should be removed urls: ', urls);
    return doRemoved ? remove(urls) : 0;
  });
}

/**
 * remove visit item by keyword in given specific time
 *
 * @param {string} key search keyword
 * @param {Date} [startTime=897494400000] - millisecond default:1998-06-11 0:00:00
 * @param {Date} [endTime=new Date().getTime()] - millisecond
 * @return { Promise } removed count
 */
export function removeByKeywordInRange(key, startTime = START_TIME, endTime = new Date().getTime()) {
  checkKeyword(key);

  const _start = new Date(startTime);
  const _end = new Date(endTime);

  if (isNaN(_start)) {
    throw new Error('startTime should be date in milliseconds, now is ' + startTime);
  }

  if (isNaN(_end)) {
    throw new Error('endTime should be date in milliseconds, now is ' + endTime);
  }

  return search({ text: key, startTime: _start.getTime(), endTime: _end.getTime() }).then(urls => {
    console.log('should be removed urls: ', urls);
    if (doRemoved) remove(urls);
  });
}
