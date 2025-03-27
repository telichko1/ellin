import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";

const ServiceCard = ({ service, delay = 0, isActive = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [initialTouchPosition, setInitialTouchPosition] = useState(null);

  // Эффект для анимации появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100 + delay * 200);
    return () => clearTimeout(timer);
  }, [delay]);

  // Отслеживание движения мыши для 3D эффекта
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Нормализуем позицию от -1 до 1
      const normalizedX = x / (rect.width / 2);
      const normalizedY = y / (rect.height / 2);

      // Уменьшаем интенсивность эффекта для мобильных
      const intensity = isMobile ? 0.5 : 1;

      setMousePosition({ x, y });
      setRotation({
        x: normalizedY * -8 * intensity, // Инвертируем ось Y для естественного наклона
        y: normalizedX * 8 * intensity,
      });
    }
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Обработчики для касаний на мобильных устройствах
  const handleTouchStart = (e) => {
    if (isMobile && cardRef.current) {
      const touch = e.touches[0];
      setInitialTouchPosition({
        x: touch.clientX,
        y: touch.clientY,
      });
      setIsHovered(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isMobile && cardRef.current && initialTouchPosition) {
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();

      // Рассчитываем смещение от центра карточки
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = touch.clientX - centerX;
      const y = touch.clientY - centerY;

      // Нормализуем позицию от -1 до 1
      const normalizedX = x / (rect.width / 2);
      const normalizedY = y / (rect.height / 2);

      // Применяем более мягкий эффект для мобильных
      setRotation({
        x: normalizedY * -3,
        y: normalizedX * 3,
      });
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setIsHovered(false);
      // Плавно возвращаем карточку в исходное положение
      setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 100);
      setInitialTouchPosition(null);
    }
  };

  const handleClick = () => {
    // Изменено с order на service для перехода к детальному просмотру
    navigate(`/service/${service.id}`);
  };

  // Вычисляем случайные параметры для индивидуализации карточек
  const randomRotate = (Math.random() * 0.6 - 0.3).toFixed(2);
  const randomGradient =
    Math.random() > 0.5
      ? "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.45) 100%)";

  // Рассчитываем строку с длительностью услуги
  const getDurationString = () => {
    if (typeof service.duration === "number") {
      const hours = Math.floor(service.duration / 60);
      const minutes = service.duration % 60;
      return `${hours > 0 ? `${hours} ч ` : ""}${
        minutes > 0 ? `${minutes} мин` : ""
      }`;
    }
    return service.duration;
  };

  // Различные стили для разных размеров экрана
  const getBorderRadius = () => {
    if (isMobile) return "20px";
    if (isTablet) return "22px";
    return "24px";
  };

  const getBoxShadow = () => {
    if (isHovered) {
      return "0 25px 40px -15px rgba(0, 0, 0, 0.25), 0 0 30px rgba(232, 90, 79, 0.2)";
    } else if (isActive) {
      return "0 15px 30px -10px rgba(0, 0, 0, 0.15), 0 0 20px rgba(232, 90, 79, 0.1)";
    } else {
      return "0 10px 20px -5px rgba(0, 0, 0, 0.1)";
    }
  };

  const getTransform = () => {
    if (isHovered) {
      return `translateZ(40px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    } else if (isActive) {
      return `scale(${isMobile ? 1.05 : 1.02}) translateY(-5px)`;
    } else {
      return `scale(1) rotateX(0) rotateY(${randomRotate}deg)`;
    }
  };

  // Делаем фон карточки более непрозрачным для мобильных устройств
  const getCardBackground = () => {
    if (isMobile) {
      return `linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.75) 100%)`;
    }
    return `linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.5) 100%)`;
  };

  // Улучшаем контрастность текста для мобильной версии
  const getTextColor = () => {
    return isMobile ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.8)";
  };

  return (
    <Box
      sx={{
        perspective: isMobile ? "1000px" : "2000px",
        transformStyle: "preserve-3d",
        position: "relative",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "--delay": delay,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-12px",
          left: "10%",
          right: "10%",
          height: "15px",
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.15)",
          filter: "blur(8px)",
          transform:
            isHovered || isActive
              ? "translateY(3px) scale(0.95)"
              : "translateY(0) scale(0.8)",
          opacity: isHovered || isActive ? 0.6 : 0.3,
          transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          zIndex: -1,
        },
        boxSizing: "border-box",
      }}
      className="card-reveal"
      ref={cardRef}
    >
      <Card
        className="service-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        sx={{
          borderRadius: getBorderRadius(),
          padding: isMobile ? "8px" : "12px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: getCardBackground(),
          backdropFilter: isMobile ? "blur(12px)" : "blur(8px)",
          border: isMobile
            ? "1px solid rgba(255,255,255,0.5)"
            : "1px solid rgba(255,255,255,0.3)",
          transform: getTransform(),
          transition:
            "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, background-image 0.5s ease",
          boxShadow: getBoxShadow(),
          willChange: "transform, box-shadow",
          "&:hover": {
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
          },
          position: "relative",
          overflow: "visible",
          transformStyle: "preserve-3d",
          background: alpha(theme.palette.background.paper, 0.5),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: getBorderRadius(),
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)",
            opacity: isHovered || isActive ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 1,
            pointerEvents: "none",
          },
        }}
      >
        <CardContent
          sx={{
            p: isMobile ? 1.75 : 2.5,
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "100%",
            boxSizing: "border-box",
            transformStyle: "preserve-3d",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            className="service-title"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: theme.palette.text.primary,
              transform: isHovered ? "translateZ(30px)" : "translateZ(0)",
              transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              position: "relative",
              transformStyle: "preserve-3d",
              textAlign: "left",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: "-6px",
                height: "3px",
                width: isHovered || isActive ? "60%" : "30%",
                background:
                  "linear-gradient(90deg, #e85a4f 0%, rgba(232, 90, 79, 0.3) 100%)",
                borderRadius: "2px",
                transition: "all 0.4s ease",
                transform: isHovered ? "translateZ(5px)" : "translateZ(0)",
              },
              wordWrap: "break-word",
              maxWidth: "100%",
              fontSize: isMobile ? "1rem" : isTablet ? "1.1rem" : "1.3rem",
              lineHeight: 1.35,
            }}
          >
            {service.title || service.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
              opacity: isHovered ? 1 : 0.8,
              transform: isHovered
                ? "translateZ(25px) translateY(-2px)"
                : "translateZ(0)",
              transition: "all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
              flexWrap: "wrap",
              gap: 1,
              transformStyle: "preserve-3d",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.secondary, 0.85),
                fontSize: isMobile ? "0.75rem" : isTablet ? "0.8rem" : "0.9rem",
                fontWeight: 500,
                transform: isHovered ? "translateZ(5px)" : "translateZ(0)",
              }}
            >
              Длительность: {getDurationString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: isMobile ? "0.85rem" : isTablet ? "0.9rem" : "1rem",
                transform: isHovered ? "translateZ(10px)" : "translateZ(0)",
                transition: "all 0.3s ease",
              }}
            >
              {service.price} ₽
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: alpha(theme.palette.text.secondary, 0.9),
              lineHeight: 1.6,
              fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.92rem",
              transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
              transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              minHeight: { xs: "4rem", sm: "4.5rem", md: "5rem" },
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              wordWrap: "break-word",
              transformStyle: "preserve-3d",
              flex: 1,
            }}
          >
            {service.description}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            className="service-button animated-btn"
            onClick={handleClick}
            sx={{
              background: "linear-gradient(45deg, #e85a4f 0%, #ff8a80 100%)",
              mt: "auto",
              py: isMobile ? 0.8 : isTablet ? 1 : 1.2,
              fontWeight: 600,
              borderRadius: isMobile ? "14px" : "16px",
              textTransform: "none",
              boxShadow: isHovered
                ? "0 15px 30px rgba(232, 90, 79, 0.5), 0 5px 15px rgba(232, 90, 79, 0.25)"
                : "0 8px 20px rgba(232, 90, 79, 0.3)",
              transform: isHovered
                ? "translateZ(35px) translateY(-3px)"
                : "translateZ(0)",
              transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              position: "relative",
              overflow: "hidden",
              transformStyle: "preserve-3d",
              fontSize: isMobile ? "0.85rem" : isTablet ? "0.9rem" : "1rem",
              letterSpacing: "0.5px",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "0",
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))",
                transition: "all 0.5s ease",
                zIndex: 0,
              },
              "&:hover": {
                background: "linear-gradient(45deg, #e85a4f 0%, #ff8a80 100%)",
                transform: "translateZ(40px) translateY(-5px)",
                boxShadow:
                  "0 20px 35px rgba(232, 90, 79, 0.6), 0 8px 20px rgba(232, 90, 79, 0.35)",
                "&::before": {
                  left: "100%",
                },
              },
            }}
          >
            Подробнее
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceCard;
