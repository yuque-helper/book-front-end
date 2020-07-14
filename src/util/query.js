import qs from 'query-string';

/**
 * 从search中解析query
 * @param {String} search 
 */
export const getQuery = (search) => {
  return qs.parse(search);
}

/**
 * 从query中生成search
 * @param {Object} query
 */
export const getSearch = (query) => {
  return '?' + qs.stringify(query);
}