import React from "react";
import { Breadcrumbs } from "@mui/material";
import { styled, emphasize } from "@mui/material/styles";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UilAngleRight } from "@iconscout/react-unicons";
export default function Breadcrumb({ data }) {
  const StyledBreadcrumb = styled("span")(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      borderRadius: theme.shape.borderRadius,
      fontFamily: '"Nunito", sans-serif ',
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      "&:active": {
        color: "#1230AE",
      },
      "&:hover": {
        color: "#1230AE",
      },
    };
  });
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <UilAngleRight fontSize="small" style={{ color: "#1230AE" }} />
      }
    >
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <StyledBreadcrumb style={{ color: "#1230AE" }}>
          <FaHome
            fontSize="small"
            style={{ marginRight: 4, fontSize: "17px" }}
          />
          Dashboard
        </StyledBreadcrumb>
      </Link>
      {data.map((item, i) => {
        const isLast = i === data.length - 1;
        return isLast ? (
          <StyledBreadcrumb key={i}>{item.name}</StyledBreadcrumb>
        ) : (
          <Link
            to={item.link || "#"}
            key={i}
            style={{ textDecoration: "none" }}
          >
            <StyledBreadcrumb style={{ color: "#1230AE" }}>
              {item.name}
            </StyledBreadcrumb>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}