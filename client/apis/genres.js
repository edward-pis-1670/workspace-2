import { API_URL } from ".";

export const getAllGenres = (callback) => {
  $.get(API_URL + "/genre/all", callback);
};
