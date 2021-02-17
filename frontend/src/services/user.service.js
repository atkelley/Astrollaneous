import api from "../components/apis/api";

class UserDataService {
  getUser = (userId) => { 
    return api.get(`/user/${userId}`); 
  }

  getUserPosts = (userId) => { 
    return api.get(`/user/${userId}/posts`); 
  }


  getUserComments = (userId) => { 
    return api.get(`/user/${userId}/comments`); 
  }
}

export default new UserDataService();