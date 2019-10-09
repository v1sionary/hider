const browser = require('webextension-polyfill');

const doRemoved = true;

// new Date('1998-06-11 0:00:00').getTime()
const START_TIME = 897494400000;
const MAX_COUNT = 9999;

function search(key = '', startTime = START_TIME, endTime = new Date().getTime(), maxResults = MAX_COUNT) {
  return browser.history
    .search({
      text: key,
      startTime,
      endTime,
      maxResults,
    })
    .then(visits => {
      console.log('visits', visits);
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
 * @return { Promise } removed count
 */
export function removeByKeyword(key) {
  checkKeyword(key);

  return search(key).then(urls => {
    console.log('should be removed urls: ', urls);
    return doRemoved ? remove(urls) : 0;
  });
}

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

  console.log(key, startTime, endTime);

  return search(key, _start.getTime(), _end.getTime()).then(urls => {
    console.log('should be removed urls: ', urls);
    if (doRemoved) remove(urls);
  });
}
