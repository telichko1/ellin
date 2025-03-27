import React from "react";
import { Button, Box, useTheme, alpha } from "@mui/material";

const PulseButton = ({
  children,
  onClick,
  color = "primary",
  variant = "contained",
  size = "medium",
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        "@keyframes pulse": {
          "0%": {
            transform: "scale(1)",
            opacity: 0.3,
          },
          "70%": {
            transform: "scale(1.5)",
            opacity: 0,
          },
          "100%": {
            transform: "scale(1.7)",
            opacity: 0,
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor:
            variant === "contained"
              ? alpha(theme.palette[color].main, 0.3)
              : alpha(theme.palette[color].main, 0.15),
          borderRadius: "12px",
          animation: "pulse 1.5s infinite",
          zIndex: -1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor:
            variant === "contained"
              ? alpha(theme.palette[color].main, 0.2)
              : alpha(theme.palette[color].main, 0.1),
          borderRadius: "12px",
          animation: "pulse 1.5s infinite 0.3s",
          zIndex: -1,
        },
      }}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={onClick}
        sx={{
          position: "relative",
          zIndex: 1,
          whiteSpace: "nowrap",
          borderRadius: "12px",
          boxShadow:
            variant === "contained"
              ? `0 6px 16px ${alpha(theme.palette[color].main, 0.25)}`
              : "none",
          transition: "all 0.3s ease",
          transform: "translateY(0)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow:
              variant === "contained"
                ? `0 10px 20px ${alpha(theme.palette[color].main, 0.4)}`
                : "none",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};

export default PulseButton;
