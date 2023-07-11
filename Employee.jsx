import React, { useState, useEffect } from "react";
import { searchItem, deleteItem } from "./EmployeeService";
import MaterialTable from "material-table";
import { Breadcrumb } from "egret";
import { useTranslation } from "react-i18next";
import { Grid, IconButton, Icon, Button, TextField } from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import EmployeeDialog from "./EmployeeDialog";
import EmployeeDelete from "./EmployeeDelete";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

const Employee = () => {
  const { t, i18n } = useTranslation();
  const [editData, setEditData] = useState({});
  const [listEmployees, setListEmployees] = useState([]);
  const [reloadEmployees, setReloadEmployees] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await searchItem({ keyword: searchInputValue });
      setListEmployees(response?.data?.data?.content);
      console.log(response);
    };
    fetchData();
  }, [reloadEmployees, searchInputValue]);

  const columns = [
    {
      title: "Thao Tác",
      field: "custom",
      width: "5%",
      render: (data) => {
        return (
          <div>
            <IconButton
              onClick={() => {
                handleEdit(data);
              }}
            >
              <Icon color="primary">edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                handleDelete(data?.id);
              }}
            >
              <Icon style={{ color: "red" }}>delete</Icon>
            </IconButton>
          </div>
        );
      }
    },
    {
      title: "Họ và Tên",
      field: "name",
      width: "5%"
    },
    {
      title: "Tuổi",
      field: "age",
      width: "5%"
    },
    {
      title: "Số Điện Thoại",
      field: "phone",
      width: "5%"
    },
    {
      title: "Email",
      field: "email",
      width: "5%"
    }
  ];

  const handleAdd = () => {
   setShowAddDialog(true);
  };

  const handleClose = () => {
   setShowAddDialog(false);
   setReloadEmployees(!reloadEmployees);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setShowAddDialog(true);
  };

  const handleDelete = (id) => {
    setShowDeleteDialog(true);
    setSelectedEmployeeId(id);
  };

  const handleDialogClose = () => {
    setShowDeleteDialog(false);
   
  };

  // xuất Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(listEmployees);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });
    saveAs(excelData, `employeesData.xlsx`);
    toast.success("Thành công!");
  };

  const handleConfirmationResponse = async () => {
   //api xóa 
   try {
    await deleteItem(selectedEmployeeId);
    setReloadEmployees(!reloadEmployees);
    handleDialogClose();
    toast.success("Xóa thành công")
   } catch (error) {
    toast.warning(t("Không thể xóa danh mục này"));
   }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: t("Dashboard.manage"), path: "/directory/apartment" },
            { name: t("staff.title") }
          ]}
        />
        <Grid
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px"
          }}
        >
          <Button
            className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={()=>handleAdd()}
          >
            {t("Add")}
          </Button>
          <Button
            className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={()=>handleExportExcel()}
          >
            Xuất Excel
          </Button>
          {/* Tìm kiếm  */}
          <TextField
            label="Tìm kiếm"
            type="text"
            size="small"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            style={{ width: "450px", marginLeft: "auto" }}
          />
        </Grid>
        {showDeleteDialog && (
          <EmployeeDelete
            open={showDeleteDialog}
            onClose={() => handleDialogClose()}
            handleDialogDelete={handleConfirmationResponse}
          />
        )}
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {/* bảng danh sách nv */}
            <MaterialTable
              columns={columns}
              data={listEmployees}
              options={{
                rowStyle: (rowData, index) => ({
                  backgroundColor: index % 2 === 1 ? "#EEEE" : "#FFF"
                }),
                minBodyHeight: "600px",
                headerStyle: {
                  backgroundColor: "#358600",
                  color: "#fff"
                },
                padding: "dense",
                search: false,
                sorting: true,
                paging: true,
                pageSize: 10,
                filtering: false,
                toolbar: false,
                header: true
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: "Không có dữ liệu"
                }
              }}
            />
          </Grid>
        </Grid>
      </div>
      {showAddDialog && (
        <EmployeeDialog
          open={showAddDialog}
          onClose={() => handleClose()}
          setEditData={setEditData}
          editData={editData}
        />
      )}
    </div>
  );
};
export default Employee;
