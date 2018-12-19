import _ from 'lodash';

export const toTreeToc = (listToc) => {
  const toc = _.cloneDeep(listToc);

  if(!Array.isArray(toc)){
    throw Error('toc 不是一个数组');
  }

  const length = toc.length;
  for(let i = length - 1; i >= 0; i--){
    const t = toc.pop();
    if(t.depth === 1){
      toc.unshift(
        {
          ...t,
          key: t.title + t.slug + t.depth
        }
      );
      continue;
    }
    findAndInsert(t, toc);
  }
  return toc;
};

// 找到最近的一个父节点, 并且unshift
const findAndInsert = (t, toc) => {
  for(let i = toc.length - 1; i >= 0; i--){
    if(toc[i].depth === t.depth - 1){
      if(!toc[i].children){
        toc[i].children = [];
      }
      toc[i].children.unshift(t);
      return;
    }
  }
}

/**
 * @param {string} slug 绝对路径和#都会被认定为false
 * @return boolean
 */
export const isJumpableSlug = (slug) => {
  if(slug === '#'){
    return false;
  }

  // if(/^https?:\/\/.+$/.test(slug)){
  //   return false;
  // }

  return true;
}

export const getDocKey = (doc) => {
  return `${doc.slug}_${doc.depth}_${doc.title}`;
}

/**
 * 得到slug和parent节点的映射
 * @param {TreeToc} treeToc 树形toc
 */
export const getParentIndex = (treeToc) => {
  if(!treeToc){
    return {};
  }

  let index = {};
  for(let toc of treeToc){
    if(toc.children){
      for(let child of toc.children){
        index[getDocKey(child)] = toc;
      }

      const next = getParentIndex(toc.children);
      index = {
        ...index,
        ...next
      }
    }
  }

  return index;
}


const getSlugKey = (listToc, slug) => {
  const doc = _.find(listToc, {slug: slug});
  if(doc){
    return getDocKey(doc);
  }
  return null;
};

/**
 * 获取默认展开的路径
 * @param {TreeToc} treeToc 
 * @param {string} slug 
 * @return {array}
 */
export const getPathToParent = (treeToc, listToc, slug) => {
  const parentIndex = getParentIndex(treeToc);
  const slugKey = getSlugKey(listToc, slug);

  let curSlugKey = slugKey;
  const path = [];

  if(slug === '#'){
    return [];
  }

  while(parentIndex[curSlugKey]){
    const toc = parentIndex[curSlugKey];
    const key = getDocKey(toc);
    path.push(key);
    curSlugKey = key;
  }

  return path;
}