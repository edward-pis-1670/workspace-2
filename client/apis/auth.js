export const login = (data, callback) => {
  $.post('/authentication/login', data, callback);
};

export const signup = (data, callback) => {
  $.post('/authentication/signup', data, callback);
};

export const forgotPassword = (data, callback) => {
  $.post('/authentication/forgotpassword', data, callback);
};

export const logout = (callback) => {
  $.get('/authentication/logout', callback);
};
