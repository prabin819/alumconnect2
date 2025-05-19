// utils/buildUrl.js
export const buildUrl = (template, params = {}) => {
  return template.replace(/:([a-zA-Z]+)/g, (_, key) => {
    if (params[key] == null) {
      throw new Error(`Missing URL param: ${key}`);
    }
    return encodeURIComponent(params[key]);
  });
};
