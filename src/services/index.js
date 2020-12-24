import request from 'superagent';
const baseUrl = 'data/json';

export const toc = async () => {
  return request.get(`${baseUrl}/toc.json`).then(d => d.body);
}

export const searchDoc = async () => {
  try {
    return request.get(`data/search/search.json`).then(d => d.body);
  } catch(error)  {
    console.error(error)
  }
}

export const searchTitle = async () => {
  try {
    return request.get(`data/search/search-title.json`).then(d => d.body);
  } catch(error)  {
    console.error(error)
  }
}



export const doc = async (slug) => {
  return request.get(`${baseUrl}/${slug}.json`).then(d => d.body);
}

export const getFirstSlug = async () => {
  const result = await toc();
  for(let toc of result){
    if(toc.slug !== '#'){
      return toc.slug;
    }
  }
}

export const book = async () => {
  return request.get(`${baseUrl}/book.json`).then(d => d.body);
}

export const getFirstSlugByToc = result => {
  if (!result) {
    return "";
  }
  for (let toc of result) {
    if (toc.slug !== "#") {
      return toc.slug;
    }
  }
};
