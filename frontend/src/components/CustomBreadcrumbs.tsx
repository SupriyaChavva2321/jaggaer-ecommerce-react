import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CustomBreadcrumbsProps } from "../models/types";

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return isLast || !item.path ? (
            <Typography key={index} color="text.primary">
              {item.label}
            </Typography>
          ) : (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path!);
              }}
              sx={{ cursor: "pointer" }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
