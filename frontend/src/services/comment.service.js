import api from "../components/apis/api";

class CommentDataService {
  create(data) {
    return api.post('/comments/create', data);
  }

  update(id, data) {
    return api.put(`/comments/update/${id}`, data);
  }

  delete(id) {
    return api.delete(`/comments/delete/${id}`);
  }
}

export default new CommentDataService();