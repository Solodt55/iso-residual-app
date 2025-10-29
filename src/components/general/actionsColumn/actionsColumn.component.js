import React from "react";
import { Box, IconButton } from "@mui/material";
import { Edit, Delete, Check } from "@mui/icons-material";

const ActionsColumn = ({ onEdit, onDelete, onApprove, isAdmin = false }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1, // Space between buttons
    }}
  >
    {isAdmin && onEdit && (
      <IconButton color="primary" onClick={onEdit}>
        <Edit />
      </IconButton>
    )}
    {isAdmin && onDelete && (
      <IconButton color="error" onClick={onDelete}>
        <Delete />
      </IconButton>
    )}
    {isAdmin && onApprove && (
      <IconButton color="success" onClick={onApprove}>
        <Check />
      </IconButton>
    )}
  </Box>
);

export default ActionsColumn;
