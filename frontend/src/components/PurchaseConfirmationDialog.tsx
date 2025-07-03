import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PurchaseConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
}

const PurchaseConfirmationDialog: React.FC<PurchaseConfirmationDialogProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoBackHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Purchase Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Thank you for your order. A confirmation email with the order details
          has been sent to your inbox. We appreciate your business and look
          forward to serving you again!
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={handleGoBackHome}
          variant="text"
          sx={{ textTransform: "uppercase" }}
        >
          Go Back To Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseConfirmationDialog;
