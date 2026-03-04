import axios from "axios";

const API =axios.create({
    baseURL: "http://localhost:5000/api"
});
export const fetchBuildings = ()=>{
   return API.get("/buildings/all-buildings");
}

export const fetchEnergyBuilding = (id) =>{
   return API.get(`/energy/building/${id}`);
}