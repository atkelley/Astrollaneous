import api from "../components/apis/api";

class PostDataService {
  getPosts = () => { 
    return api.get('/posts'); 
  }

  getPost = (id) => { 
    return api.get(`/posts/${id}`); 
  }

  create(data) {
    return api.post('/posts/create', data);
  }

  update(id, data) {
    return api.put(`/posts/update/${id}`, data);
  }

  delete(id) {
    return api.delete(`/posts/delete/${id}`);
  }

  deleteAll() {
    return api.delete(`/posts`);
  }

  findByTitle(title) {
    return api.get(`/posts?title=${title}`);
  }
}

export default new PostDataService();
