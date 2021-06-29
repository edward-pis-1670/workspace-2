import { API_URL } from ".";

export const getCoursesByGenre = ({ genreid, success, xhr }) => {
  $.ajax({
    method: "GET",
    url:
      API_URL + "/courses/get-courses-by-genre/" + genreid,
    success,
    xhr,
  });
};

export const getCoursesBySubGenre = ({ subgenreid, data, success, xhr }) => {
  $.ajax({
    method: "post",
    url:
      API_URL +
      "/courses/get-course-by-subgenre/" +
      subgenreid,
    data,
    success,
    xhr,
  });
};

export const getCoursesSearch = ({ data, success, xhr }) => {
  $.ajax({
    method: "POST",
    url: API_URL + "/courses/search",
    data,
    success,
    xhr,
  });
};

export const getCoursesHomepage = ({ success, xhr }) => {
  $.ajax({
    method: "GET",
    url: API_URL + "/courses/get-courses-homepage",
    success,
    xhr,
  });
};

export const getCoursesRelateLecture = (data, callback) => {
  $.post(
    API_URL + "/courses/get-courses-relate-lecturer",
    data,
    callback
  );
};

export const addReview = (data, callback) => {
  $.post(API_URL + "/users/add-review", data, callback);
};

export const getReview = (data, callback) => {
  $.post(API_URL + "/courses/get-reviews", data, callback);
};

export const getCourseIntro = (data, callback) => {
  $.post(
    API_URL + "/courses/get-info-course",
    data,
    callback
  );
};

export const getCourseIntroLearning = (data, callback) => {
  $.post(
    API_URL + "/users/get-info-course",
    data,
    callback
  );
};
