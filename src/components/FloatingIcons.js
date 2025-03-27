import React from "react";
import { Box, alpha, useTheme } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteIcon from "@mui/icons-material/Favorite";

const FloatingIcons = () => {
  const theme = useTheme();

  // Декоративные элементы с разными анимациями
  const floatingElements = [
    // Круги
    {
      type: "circle",
      size: 70,
      x: "15%",
      y: "20%",
      delay: 0,
      duration: 15,
      color: alpha(theme.palette.primary.main, 0.2),
    },
    {
      type: "circle",
      size: 40,
      x: "85%",
      y: "15%",
      delay: 2,
      duration: 18,
      color: alpha(theme.palette.primary.light, 0.15),
    },
    {
      type: "circle",
      size: 90,
      x: "70%",
      y: "85%",
      delay: 1,
      duration: 20,
      color: alpha(theme.palette.secondary.main, 0.1),
    },
    {
      type: "circle",
      size: 25,
      x: "10%",
      y: "70%",
      delay: 3,
      duration: 12,
      color: alpha(theme.palette.primary.dark, 0.2),
    },

    // Квадраты
    {
      type: "square",
      size: 35,
      x: "80%",
      y: "40%",
      delay: 0.5,
      duration: 17,
      color: alpha(theme.palette.secondary.light, 0.15),
    },
    {
      type: "square",
      size: 55,
      x: "30%",
      y: "80%",
      delay: 2.5,
      duration: 19,
      color: alpha(theme.palette.primary.light, 0.1),
    },
    {
      type: "square",
      size: 20,
      x: "25%",
      y: "30%",
      delay: 1.5,
      duration: 14,
      color: alpha(theme.palette.secondary.dark, 0.15),
    },

    // Треугольники
    {
      type: "triangle",
      size: 45,
      x: "60%",
      y: "25%",
      delay: 1,
      duration: 16,
      color: alpha(theme.palette.primary.main, 0.15),
    },
    {
      type: "triangle",
      size: 30,
      x: "45%",
      y: "75%",
      delay: 3.5,
      duration: 18,
      color: alpha(theme.palette.secondary.main, 0.12),
    },

    // Плюсы
    {
      type: "plus",
      size: 25,
      x: "75%",
      y: "60%",
      delay: 2,
      duration: 15,
      color: alpha(theme.palette.primary.dark, 0.2),
    },
    {
      type: "plus",
      size: 15,
      x: "20%",
      y: "50%",
      delay: 0.7,
      duration: 13,
      color: alpha(theme.palette.secondary.dark, 0.18),
    },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {floatingElements.map((element, index) => {
        // Базовые стили для всех элементов
        const baseStyles = {
          position: "absolute",
          left: element.x,
          top: element.y,
          opacity: 0.7,
          transform: "translate(-50%, -50%)",
          animation: `float ${
            element.duration
          }s ease-in-out infinite alternate, 
                      rotate ${element.duration * 2}s linear infinite, 
                      fadeIn 1.5s ease-out`,
          animationDelay: `${element.delay}s, ${element.delay}s, ${element.delay}s`,
          filter: "blur(1px)",
          backdropFilter: "blur(5px)",
          backgroundColor: element.color,
          boxShadow: `0 5px 20px ${alpha(element.color, 0.4)}`,
        };

        // Специфичные стили в зависимости от типа элемента
        let specificStyles = {};

        switch (element.type) {
          case "circle":
            specificStyles = {
              width: element.size,
              height: element.size,
              borderRadius: "50%",
            };
            break;
          case "square":
            specificStyles = {
              width: element.size,
              height: element.size,
              borderRadius: "15%",
              transform: `translate(-50%, -50%) rotate(${
                Math.random() * 45
              }deg)`,
            };
            break;
          case "triangle":
            specificStyles = {
              width: 0,
              height: 0,
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}`,
              backgroundColor: "transparent",
              boxShadow: "none",
            };
            break;
          case "plus":
            specificStyles = {
              width: element.size,
              height: element.size,
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                height: "20%",
                backgroundColor: element.color,
                transform: "translateY(-50%)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                left: "50%",
                top: 0,
                width: "20%",
                height: "100%",
                backgroundColor: element.color,
                transform: "translateX(-50%)",
              },
            };
            break;
          default:
            break;
        }

        return (
          <Box
            key={index}
            sx={{
              ...baseStyles,
              ...specificStyles,
            }}
          />
        );
      })}
    </Box>
  );
};

export default FloatingIcons;
