import { API_URL } from ".";

$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (localStorage.getItem("token")) {
      xhr.setRequestHeader(
        "authorization",
        "Bearer " + localStorage.getItem("token")
      );
    }
  },
});

export const login = (data, callback) => {
  $.post(API_URL + "/auth/login", data, callback);
};

export const signup = (data, callback) => {
  $.post(API_URL + "/auth/register", data, callback);
};

export const forgotPassword = (data, callback) => {
  $.post(API_URL + "/auth/forgot-password", data, callback);
};

export const logout = (callback) => {
  $.get(API_URL + "/auth/logout", callback);
};
