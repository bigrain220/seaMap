import request from "@/network";

export default {
  getVessel(id) {
    return request.get(`vessels/${id}`);
  },
}