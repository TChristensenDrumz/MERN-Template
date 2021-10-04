import axios from "axios";

const PORT = "http://localhost:5000";

export default {
  login: function (userData) {
    return axios.post(`${PORT}/api/user/login`, userData);
  },

  createUser: function (userData) {
    return axios.post(`${PORT}/api/user/add`, userData);
  },

  userDetails: function (id) {
    return axios.get(`${PORT}/api/user/${id}`);
  },

  updateUser: function (id, userData) {
    return axios.put(`${PORT}/api/user/${id}`, userData);
  },

  deleteUser: function (id) {
    return axios.delete(`${PORT}/api/user/${id}`);
  },
};
