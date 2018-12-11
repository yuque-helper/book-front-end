import request from 'superagent';

const baseUrl = 'data/json';

export const toc = async () => {
  return request.get(`${baseUrl}/toc.json`).then(d => d.body);
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