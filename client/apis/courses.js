export const getCoursesByGenre = ({ genreid, success, xhr }) => {
  $.ajax({
    method: "GET",
    // url: "/get-courses-by-genre/" + genreid,
    url: "http://localhost:5000/courses/get-courses-by-genre/" + genreid,
    success,
    xhr,
  });
};

export const getCoursesBySubGenre = ({ subgenreid, data, success, xhr }) => {
  $.ajax({
    method: "post",
    // url: "/api/courses/get-courses-subgenre/" + subgenreid,
    url: "http://localhost:5000/courses/get-course-by-subgenre/" + subgenreid,
    data,
    success,
    xhr,
  });
};

export const getCoursesSearch = ({ data, success, xhr }) => {
  $.ajax({
    method: "POST",
    // url: "/api/courses/search",
    url: "http://localhost:5000/courses/search",
    data,
    success,
    xhr,
  });
};

export const getCoursesHomepage = ({ success, xhr }) => {
  $.ajax({
    method: "GET",
    url: "http://localhost:5000/courses/get-courses-homepage",
    // url: '/api/courses/get-courses-homepage',
    success,
    xhr,
  });
};

export const getCoursesRelateLecture = (data, callback) => {
  // $.post("/api/courses/get-courses-relate-lecturer", data, callback);
  $.post(
    "http://localhost:5000/courses/get-courses-relate-lecturer",
    data,
    callback
  );
};

export const addReview = (data, callback) => {
  // $.post("/api/course/add-review", data, callback);
  $.post("http://localhost:5000/users/add-review", data, callback);
};

export const getReview = (data, callback) => {
  // $.post("/api/course/get-review", data, callback);
  $.post("http://localhost:5000/courses/get-reviews", data, callback);
};

export const getCourseIntro = (data, callback) => {
  // $.post("/api/course/get-course-info", data, callback);
  $.post("http://localhost:5000/courses/get-info-course", data, callback);
};

export const getCourseIntroLearning = (data, callback) => {
  // $.post("/api/course/get-course-info", data, callback);
  $.post("http://localhost:5000/users/get-info-course", data, callback);
};
