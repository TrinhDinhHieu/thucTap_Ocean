import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  getAllProvinces,
  getDistrictsByProvinces,
  getWardsByDistricts,
  saveItem,
  updateItem
} from "./EmployeeService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { SUCCESS } from "./HTTPstatus";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

const EmployeeDialog = ({ open, onClose, editData, setEditData }) => {
  const { t, i18n } = useTranslation();
  const [getProvinces, setGetProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);

  useEffect(() => {
    const handleGetDistrictsAndWards = async () => {
      //xử lý dữ liệu all provines
      const handleGetProvinces = async () => {
        try {
          const response = await getAllProvinces();
          setGetProvinces(response?.data?.data);
        } catch (error) {
          console.error("Lỗi lấy dữ liệu tỉnh:", error);
        }
      };
      handleGetProvinces();
      if (editData?.id) {
        handleGetDistrictsByProvinces(editData?.provinceId);
        handleGetWardsByDistricts(editData?.districtId);
      }
    };
    handleGetDistrictsAndWards();
  }, [editData?.provinceId]);

  // xử lý call huyện
  const handleGetDistrictsByProvinces = async (provinceId) => {
    try {
      const districts = await getDistrictsByProvinces(provinceId);
      setListDistricts(districts?.data?.data);
      setListWards([]);
    } catch (error) {
      toast.error("Lỗi lấy dữ liệu huyện/quận");
    }
  };
  //xử lý call xã
  const handleGetWardsByDistricts = async (districtId) => {
    try {
      const wards = await getWardsByDistricts(districtId);
      setListWards(wards?.data?.data);
    } catch (error) {
      toast.error("Lỗi lấy dữ liệu xã/phường");
    }
  };

  const handleSelectChange = async (event) => {
    const { name, value } = event.target; // name là keywork , value là gtri nhận vào của object cho 1 nhân viên
    setEditData({
      ...editData,
      [name]: value ,
      // [name] :name là biến, và để tránh name biến thành String thì để trong []
    });

    if (name === "provinceId") {
      handleGetDistrictsByProvinces(value);
      setListWards([]);
    } else if (name === "districtId") {
      handleGetWardsByDistricts(value);
    }
  };

  const handleSave = async () => {
    try {
      let response;
      if (editData?.id) {
        response = await updateItem(editData);
        if (response?.data?.code === SUCCESS) {
          toast.success(" Sửa nhân viên thành công");
        } else {
          toast.error("Sửa nhân viên thất bại :" + response?.data?.message);
        }
      } else {
        response = await saveItem(editData);
        if (response?.data?.code === SUCCESS) {
          toast.success("Thêm mới thành công");
        } else {
          toast.error("Thêm mới thất bại :" + response?.data?.message);
        }
      }
      handleClose();
    } catch (error) {
      toast.error("lỗi dữ liệu");
    }
  };

  const handleClose = () => {
    onClose();
    setListDistricts([]);
    setListWards([]);
    setEditData({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <h4 className="" style={{ fontSize: "28px" }}>
          {editData?.id ? "Sửa thông tin" : "Thêm Mới Nhân Viên"}
        </h4>
        <IconButton
          aria-label="close"
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon color="error" onClick={() => handleClose()} />
        </IconButton>
      </DialogTitle>
      <ValidatorForm onSubmit={handleSave}>
        <DialogContent>
          <Grid className="" container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="code"
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Mã Nhân Viên
                  </span>
                }
                value={editData?.code}
                onChange={handleSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextValidator
                className="w-100 "
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Họ và Tên
                  </span>
                }
                name="name"
                value={editData?.name}
                onChange={handleSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Tuổi
                  </span>
                }
                name="age"
                value={editData?.age}
                onChange={handleSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Số Điện Thoại
                  </span>
                }
                name="phone"
                value={editData?.phone}
                onChange={handleSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={
                  <span className="font">
                    <span style={{ color: "red" }}> * </span>
                    Email
                  </span>
                }
                name="email"
                value={editData?.email}
                onChange={handleSelectChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>
                  {
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      Tỉnh
                    </span>
                  }
                </InputLabel>
                <Select
                  name="provinceId"
                  value={editData?.provinceId}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {getProvinces.map((province) => (
                    <MenuItem key={province?.id} value={province?.id}>
                      {province?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>
                  {
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      Quận/Huyện
                    </span>
                  }
                </InputLabel>
                <Select
                  name="districtId"
                  value={editData?.districtId}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {listDistricts.map((district) => (
                    <MenuItem key={district?.id} value={district?.id}>
                      {district?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>
                  {
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      Phường/Xã
                    </span>
                  }
                </InputLabel>
                <Select
                  name="wardsId"
                  value={editData?.wardsId}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {listWards.map((ward) => (
                    <MenuItem key={ward?.id} value={ward?.id}>
                      {ward?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            variant="contained"
            className="mr-12"
            color="secondary"
            style={{ marginLeft: "20px" }}
          >
            {t("general.cancel")}
          </Button>
          <Button
            onClick={() => handleSave()}
            color="primary"
            variant="contained"
          >
            {t("general.confirm")}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
};
export default EmployeeDialog;
