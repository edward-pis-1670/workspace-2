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
  // $.post("/authentication/login", data, callback);
  $.post("http://localhost:5000/auth/login", data, callback);
};

export const signup = (data, callback) => {
  // $.post("/authentication/signup", data, callback);
  $.post("http://localhost:5000/auth/register", data, callback);
};

export const forgotPassword = (data, callback) => {
  $.post("/authentication/forgotpassword", data, callback);
};

export const logout = (callback) => {
  // $.get("/authentication/logout", callback);
  $.get("http://localhost:5000/auth/logout", callback);
};