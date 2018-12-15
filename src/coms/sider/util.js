export const toTreeToc = (toc) => {
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
        index[child.slug] = toc;
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

/**
 * 获取默认展开的路径
 * @param {TreeToc} treeToc 
 * @param {string} slug 
 * @return {array}
 */
export const getPathToParent = (treeToc, slug) => {
  const parentIndex = getParentIndex(treeToc);
  let curSlug = slug;
  const path = [];

  while(parentIndex[curSlug]){
    const toc = parentIndex[curSlug];
    const key = toc.slug + toc.title + toc.depth;
    path.push(key);
    curSlug = toc.slug;
  }

  return path;
}