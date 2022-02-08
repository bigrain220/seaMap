import request from "@/network";

export default {
  getBerths() {
    return request.get('getAllBerth');
  },
  getStatus(id) {
    return request.get(`berthStatus`, {id});
  }
}