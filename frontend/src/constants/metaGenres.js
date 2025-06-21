// src/constants/metaGenres.js

export const metaGenreGradients = {
  rock: 'linear-gradient(to right, #ff6f61, #ff9478)',
  pop: 'linear-gradient(to right, #90D5FF, #c6e8ff)',
  'r&b': 'linear-gradient(to right, #88b04b, #a6c96a)',
  electronic: 'linear-gradient(to right, #009688, #33bbaa)',
  'hip hop': 'linear-gradient(to right, #3d6bbc, #20acc9)',
  metal: 'linear-gradient(to right, #505050, #6e6e6e)',
  folk: 'linear-gradient(to right, #8d5524, #b5773d)',
  jazz: 'linear-gradient(to right, #6b5b95, #8e78b0)',
  reggae: 'linear-gradient(to right, #33cc99, #66ddb3)',
  blues: 'linear-gradient(to right, #000080, #2e3cae)',
  country: 'linear-gradient(to right, #f4e2d8, #ba8b02)',
  'new age': 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
  classical: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
  'easy listening': 'linear-gradient(to right, #fbd3e9, #bb377d)',
  latin: 'linear-gradient(to right, #ff9a9e, #fecfef)',
  religious: 'linear-gradient(to right, #c9d6ff, #e2e2e2)',
  vocal: 'linear-gradient(to right, #fbc7d4, #9796f0)',
  indie: 'linear-gradient(to right, #f6d365, #fda085)',
  other: 'linear-gradient(to right, #000080, #2e3cae)',
};

const metaGenres = Object.keys(metaGenreGradients);

export function getMetaGenreGradient(name) {
  const key = name?.toLowerCase();
  return metaGenreGradients[key] || 'linear-gradient(to right, #666, #999)';
}

export function isMetaGenre(name) {
  return metaGenres.includes(name?.toLowerCase());
}
