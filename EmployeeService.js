import axios from "axios";
import ConstantList from "../../appConfig";

export const getAllItem = () => {
  let url = ConstantList.API_ENPOINT + "/api/employees/all";
  return axios.get(url);
};
export const getItemById = (id) => {
  let API_PATH = ConstantList.API_ENPOINT + "/api/employees";
  let url = API_PATH + "/" + id;
  return axios.get(url);
};
export const deleteItem = (id) => {
  let API_PATH = ConstantList.API_ENPOINT + "/api/employees";
  let url = API_PATH + "/" + id;
  return axios.delete(url);
};
export const saveItem = (item) => {
  let API_PATH = ConstantList.API_ENPOINT + "/api/employees";
  let url = API_PATH;
  return axios.post(url, item);
};
export const updateItem = (item) => {
  let API_PATH = ConstantList.API_ENPOINT + "/api/employees";
  let url = API_PATH + "/" + item.id;
  return axios.put(url, item);
};
export const searchItem = (search) => {
  let url = ConstantList.API_ENPOINT + "/api/employees/page";
  return axios.post(url, search);
};
// Provinces
export const getAllProvinces = () => {
  var url = ConstantList.API_ENPOINT + "/api/provinces/all";
  return axios.get(url);
};

// District
export const getDistrictsByProvinces = (id) => {
  let url = ConstantList.API_ENPOINT + `/api/provinces/${id}/districts`;
  return axios.get(url);
};
// Wards
export const getWardsByDistricts = (id) => {
  var url = ConstantList.API_ENPOINT + `/api/districts/${id}/wards`;
  return axios.get(url);
};
