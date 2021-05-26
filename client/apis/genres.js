export const getAllGenres = (callback) => {
  $.get("http://localhost:5000/genre/all", callback);
  // $.get("/api/genres/all", callback);
};
