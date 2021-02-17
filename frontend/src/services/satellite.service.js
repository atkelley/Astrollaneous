import api from "../components/apis/api";

class SatelliteDataService {
  getSatellite = (name) => {
    return api.get(`/satellites/${name}`); 
  }
}

export default new SatelliteDataService();