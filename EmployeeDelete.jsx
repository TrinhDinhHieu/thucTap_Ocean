import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";

import { useTranslation } from "react-i18next";

function EmployeeDelete({ open, onClose, handleDialogDelete }) {
  const { t, i18n } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} axWidth={"sm"} fullWidth>
      <DialogTitle>{t("general.confirm")}</DialogTitle>
      <DialogContent>
        <Typography>{t("DeleteConfirm")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={() => onClose()}>
          {t("general.cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogDelete()}
        >
          {t("general.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmployeeDelete;
