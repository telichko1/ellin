import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Breadcrumbs,
  Link,
  alpha,
  Fade,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Zoom,
  Slide,
  AppBar,
  Toolbar,
  Rating,
} from "@mui/material";

// Иконки
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CircleIcon from "@mui/icons-material/Circle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import StarsIcon from "@mui/icons-material/Stars";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Импорты для компонентов
import services from "../data/services";
import ParticlesBackground from "../components/ParticlesBackground";
import { Link as RouterLink } from "react-router-dom";

// Swiper
import { register } from "swiper/element/bundle";
register();
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Функция для получения цветов градиента на основе ID услуги
const getGradientColors = (id) => {
  const gradients = [
    {
      from: "#FF9A8B",
      to: "#FF6A88",
      text: "#5D3136",
      accent: "#FF8F7C",
      textColor: "#FFFFFF",
      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    {
      from: "#A8EDEA",
      to: "#FED6E3",
      text: "#3D3141",
      accent: "#C0EAE8",
      textColor: "#1A1A2E",
      textShadow: "0 1px 3px rgba(0,0,0,0.2)",
    },
    {
      from: "#C2E9FB",
      to: "#A1C4FD",
      text: "#2F3F54",
      accent: "#B0D8FF",
      textColor: "#FFFFFF",
      textShadow: "0 2px 8px rgba(0,0,0,0.4)",
    },
    {
      from: "#FCCB90",
      to: "#D57EEB",
      text: "#5C396C",
      accent: "#E992ED",
      textColor: "#FFFFFF",
      textShadow: "0 2px 10px rgba(0,0,0,0.35)",
    },
    {
      from: "#E2B0FF",
      to: "#9F44D3",
      text: "#3D2E4A",
      accent: "#C47DFF",
      textColor: "#FFFFFF",
      textShadow: "0 2px 10px rgba(0,0,0,0.4)",
    },
    {
      from: "#F5F7FA",
      to: "#C3CFE2",
      text: "#283648",
      accent: "#D5DFEE",
      textColor: "#1A1E29",
      textShadow: "0 1px 4px rgba(0,0,0,0.15)",
    },
    {
      from: "#74EBD5",
      to: "#9FACE6",
      text: "#395266",
      accent: "#85DCD1",
      textColor: "#FFFFFF",
      textShadow: "0 2px 8px rgba(0,0,0,0.3)",
    },
    {
      from: "#6A11CB",
      to: "#2575FC",
      text: "#192F60",
      accent: "#4D46FF",
      textColor: "#FFFFFF",
      textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    },
    {
      from: "#FF9A8B",
      to: "#FF6A88",
      text: "#5D3136",
      accent: "#FF8F7C",
      textColor: "#FFFFFF",
      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    {
      from: "#FFD3A5",
      to: "#FD6585",
      text: "#662D44",
      accent: "#FFBA7A",
      textColor: "#FFFFFF",
      textShadow: "0 2px 10px rgba(0,0,0,0.35)",
    },
  ];

  // Возвращаем градиент на основе ID (с цикличностью)
  return gradients[(id - 1) % gradients.length];
};

function ServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Все хуки должны быть вызваны на верхнем уровне компонента
  const [service, setService] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(70);
  const [isInView, setIsInView] = useState(false);
  const [perspective, setPerspective] = useState({ x: 0, y: 0 });
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [relatedServices, setRelatedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [touchPosition, setTouchPosition] = useState(null);

  // Для 3D карусели
  const [activeRelatedIndex, setActiveRelatedIndex] = useState(0);
  const relatedScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [cardsRotation, setCardsRotation] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const cardRef = useRef(null);

  // Генерируем градиентный фон для заголовка на основе ID услуги
  const getGradient = () => {
    if (!service) return "linear-gradient(135deg, #E85A4F 0%, #FF8A80 100%)";
    const serviceId = parseInt(service.id);
    const colors = getGradientColors(serviceId);
    return `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`;
  };

  // Получаем цвета в формате объекта для более гибкого использования
  const getServiceColors = () => {
    // Напрямую используем наше собственное getGradientColors
    return getGradientColors(parseInt(id));
  };

  // Находим реальную высоту хедера при загрузке страницы
  useEffect(() => {
    const header =
      document.querySelector("header") ||
      document.querySelector(".MuiAppBar-root");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    // Устанавливаем анимацию с небольшой задержкой
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Инициализация массива для сохранения углов поворота карточек похожих услуг
  useEffect(() => {
    if (!isInitialized && relatedServices.length > 0) {
      const initialRotations = relatedServices.map(() => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 0.5,
      }));
      setCardsRotation(initialRotations);
      setIsInitialized(true);
    }
  }, [isInitialized, relatedServices]);

  // Обработчик 3D эффекта
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setPerspective({ x, y });
  };

  const handleMouseLeave = () => {
    setPerspective({ x: 0, y: 0 });
  };

  // Загружаем данные об услуге при изменении ID
  useEffect(() => {
    const foundService = services.find((s) => s.id === parseInt(id));

    if (foundService) {
      setService(foundService);
      // Прокрутка вверх при загрузке страницы
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  // Показываем мобильную панель действий при скролле
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        if (window.scrollY > 200) {
          setShowMobileActions(true);
        } else {
          setShowMobileActions(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  // Обработчики событий
  const handleOrderClick = () => {
    navigate(`/order/${id}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Обработчик касания для свайпа между услугами
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    if (!touchPosition || !isMobile || !service) return;

    const currentPosition = e.touches[0].clientX;
    const difference = touchPosition - currentPosition;

    // Если свайп был достаточно сильным, перейдем к предыдущей или следующей услуге
    if (Math.abs(difference) > 50) {
      // Находим индекс текущей услуги
      const currentIndex = services.findIndex((s) => s.id === service.id);

      if (difference > 0) {
        // Свайп влево - переходим к следующей услуге
        const nextIndex = (currentIndex + 1) % services.length;
        setIsLoading(true);
        navigate(`/service/${services[nextIndex].id}`);
      } else {
        // Свайп вправо - переходим к предыдущей услуге
        const prevIndex =
          (currentIndex - 1 + services.length) % services.length;
        setIsLoading(true);
        navigate(`/service/${services[prevIndex].id}`);
      }

      setTouchPosition(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchPosition(null);
  };

  // Извлекаем преимущества из longDescription
  const extractBenefits = () => {
    if (!service) return [];
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      service.longDescription,
      "text/html"
    );
    const listItems = htmlDoc.querySelectorAll("li");
    return Array.from(listItems)
      .map((item) => item.textContent)
      .slice(0, 4);
  };

  // Вытаскиваем описание из longDescription без списка
  const extractDescription = () => {
    if (!service) return [];
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      service.longDescription,
      "text/html"
    );
    const paragraphs = htmlDoc.querySelectorAll("p");
    return Array.from(paragraphs).map((p) => p.textContent);
  };

  // Рассчитываем данные заранее
  const benefits = service ? extractBenefits() : [];
  const descriptionParagraphs = service ? extractDescription() : [];
  const serviceColors = service ? getServiceColors() : {};

  // Если услуга не найдена, показываем пустой экран
  if (!service) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: `${headerHeight}px`,
        position: "relative",
        minHeight: "100vh",
        pb: isMobile ? 5 : 4,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ParticlesBackground variant="default" />

      <Container
        maxWidth="lg"
        sx={{
          pt: isMobile ? 2 : 4,
          pb: isMobile ? 6 : 4,
          transition: "padding 0.3s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: isMobile ? 1.5 : 3,
          }}
        >
          {/* Верхняя секция с информацией об услуге */}
          <Paper
            elevation={0}
            sx={{
              p: 0,
              mb: isMobile ? 1.5 : 2,
              borderRadius: "16px",
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(15px)",
              border: `1px solid ${alpha(serviceColors.accent, 0.3)}`,
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 10px 30px ${alpha(
                theme.palette.common.black,
                0.1
              )}, 0 0 10px ${alpha(serviceColors.accent, 0.2)}`,
            }}
          >
            {/* Верхняя полоска с градиентом */}
            <Box
              sx={{
                width: "100%",
                height: "8px",
                background: `linear-gradient(90deg, ${serviceColors.from}, ${serviceColors.to})`,
                zIndex: 5,
              }}
            />

            {/* Основное содержимое */}
            <Box sx={{ p: isMobile ? 2.5 : 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: "space-between",
                  mb: isMobile ? 2 : 1,
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        color: serviceColors.text,
                        mr: 1,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -5,
                          left: 0,
                          width: "40%",
                          height: 3,
                          background: `linear-gradient(90deg, ${serviceColors.from}, ${serviceColors.to})`,
                          borderRadius: 2,
                        },
                      }}
                    >
                      {service.title}
                    </Typography>

                    {service.available !== false && (
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon style={{ fontSize: "14px" }} />}
                        label="Доступно"
                        sx={{
                          height: "24px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: alpha(
                            theme.palette.success.main,
                            0.15
                          ),
                          color: theme.palette.success.main,
                          border: `1px solid ${alpha(
                            theme.palette.success.main,
                            0.25
                          )}`,
                          ml: 1,
                          "& .MuiChip-icon": {
                            color: theme.palette.success.main,
                            mr: 0.3,
                          },
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 2,
                      mt: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: alpha(serviceColors.accent, 0.1),
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        border: `1px solid ${alpha(
                          serviceColors.accent,
                          0.15
                        )}`,
                      }}
                    >
                      <AccessTimeIcon
                        fontSize="small"
                        sx={{ color: serviceColors.text, mr: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: serviceColors.text,
                        }}
                      >
                        {service.duration}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: alpha(serviceColors.accent, 0.1),
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        border: `1px solid ${alpha(
                          serviceColors.accent,
                          0.15
                        )}`,
                      }}
                    >
                      <PersonIcon
                        fontSize="small"
                        sx={{ color: serviceColors.text, mr: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: serviceColors.text,
                        }}
                      >
                        Для всех
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    mt: isMobile ? 2 : 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      background: `linear-gradient(135deg, ${serviceColors.from} 0%, ${serviceColors.to} 100%)`,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      mb: 1.5,
                      boxShadow: `0 4px 12px ${alpha(
                        serviceColors.accent,
                        0.3
                      )}`,
                    }}
                  >
                    <LocalOfferIcon
                      sx={{ color: "#fff", mr: 1, fontSize: "1.1rem" }}
                    />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: "#fff",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      {service.price} ₽
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size={isMobile ? "large" : "large"}
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleOrderClick}
                    sx={{
                      py: 1.2,
                      px: 3,
                      fontWeight: 700,
                      minWidth: isMobile ? "100%" : "180px",
                      fontSize: "1rem",
                      boxShadow: `0 5px 15px ${alpha(
                        serviceColors.accent,
                        0.4
                      )}`,
                      background: "white",
                      color: serviceColors.text,
                      border: `1px solid ${alpha(serviceColors.accent, 0.5)}`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${alpha(
                          serviceColors.from,
                          0.05
                        )} 0%, ${alpha(serviceColors.to, 0.05)} 100%)`,
                        boxShadow: `0 8px 25px ${alpha(
                          serviceColors.accent,
                          0.5
                        )}`,
                      },
                      textTransform: "none",
                      letterSpacing: "0.5px",
                      position: "relative",
                      overflow: "hidden",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, ${alpha(
                          "#fff",
                          0.3
                        )}, transparent)`,
                        transform: "translateX(-100%)",
                        transition: "transform 1s ease",
                      },
                      "&:hover::after": {
                        transform: "translateX(100%)",
                      },
                    }}
                  >
                    Заказать
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Навигационные хлебные крошки */}
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              mb: isMobile ? 1 : 1.5,
              "& .MuiBreadcrumbs-ol": {
                flexWrap: "nowrap",
              },
              "& .MuiBreadcrumbs-li": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: isMobile ? "0.7rem" : "0.85rem",
                color: theme.palette.text.secondary,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <HomeIcon sx={{ fontSize: "0.9rem", mr: 0.5 }} />
              Главная
            </Link>
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                fontSize: isMobile ? "0.7rem" : "0.85rem",
                color: theme.palette.text.secondary,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Услуги
            </Link>
            <Typography
              color="text.primary"
              sx={{
                fontWeight: 600,
                fontSize: isMobile ? "0.7rem" : "0.85rem",
              }}
            >
              {service.title}
            </Typography>
          </Breadcrumbs>

          <Grid container spacing={isMobile ? 1 : 3}>
            {isMobile && (
              <Grid item xs={12}>
                {/* Вкладки с информацией об услуге */}
                <Paper
                  elevation={0}
                  sx={{
                    mb: isMobile ? 2 : 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: `0 2px 12px ${alpha(
                      theme.palette.common.black,
                      0.05
                    )}`,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    centered={!isMobile}
                    scrollButtons={false}
                    TabIndicatorProps={{
                      style: {
                        background: getGradient(),
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
                      },
                    }}
                    sx={{
                      minHeight: isMobile ? "42px" : "48px",
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.7
                      ),
                      backdropFilter: "blur(10px)",
                      borderBottom: `1px solid ${alpha(
                        theme.palette.divider,
                        0.1
                      )}`,
                      "& .MuiTab-root": {
                        fontWeight: 600,
                        fontSize: isMobile ? "0.75rem" : "0.85rem",
                        minHeight: isMobile ? "42px" : "48px",
                        padding: 0,
                        textTransform: "none",
                        color: theme.palette.text.secondary,
                        "&.Mui-selected": {
                          color: theme.palette.primary.main,
                          background: alpha(theme.palette.primary.main, 0.05),
                        },
                      },
                    }}
                  >
                    <Tab
                      label="Описание"
                      icon={
                        <InfoIcon
                          sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}
                        />
                      }
                      iconPosition="start"
                    />
                    <Tab
                      label="Преимущества"
                      icon={
                        <CheckCircleIcon
                          sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}
                        />
                      }
                      iconPosition="start"
                    />
                  </Tabs>

                  <Box
                    sx={{
                      p: isMobile ? 2 : 3,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.7
                      ),
                    }}
                  >
                    {/* Описание услуги */}
                    {tabValue === 0 && (
                      <Box>
                        {descriptionParagraphs.length > 0 ? (
                          <Box>
                            {descriptionParagraphs.map((paragraph, index) => (
                              <Typography
                                key={index}
                                variant="body1"
                                sx={{
                                  fontSize: "0.95rem",
                                  mb:
                                    index < descriptionParagraphs.length - 1
                                      ? 1.5
                                      : 0,
                                  lineHeight: 1.6,
                                  color: alpha(
                                    theme.palette.text.primary,
                                    0.85
                                  ),
                                }}
                              >
                                {paragraph}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontStyle: "italic",
                              color: alpha(theme.palette.text.secondary, 0.8),
                            }}
                          >
                            Подробное описание этой услуги пока не добавлено.
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Преимущества услуги */}
                    {tabValue === 1 && (
                      <Box>
                        {benefits.length > 0 ? (
                          <Grid container spacing={2}>
                            {benefits.map((benefit, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 2,
                                    height: "100%",
                                    borderRadius: 3,
                                    border: `1px solid ${alpha(
                                      serviceColors.accent,
                                      0.2
                                    )}`,
                                    background: alpha(
                                      theme.palette.background.paper,
                                      0.8
                                    ),
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      boxShadow: `0 4px 15px ${alpha(
                                        serviceColors.accent,
                                        0.2
                                      )}`,
                                      transform: "translateY(-3px)",
                                    },
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: `linear-gradient(135deg, ${serviceColors.from} 0%, ${serviceColors.to} 100%)`,
                                      mr: 1.5,
                                      mt: 0.2,
                                      flexShrink: 0,
                                    }}
                                  >
                                    <CheckCircleIcon
                                      sx={{ fontSize: "1rem", color: "#fff" }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: "0.95rem",
                                      lineHeight: 1.5,
                                      color: alpha(
                                        theme.palette.text.primary,
                                        0.85
                                      ),
                                    }}
                                  >
                                    {benefit}
                                  </Typography>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontStyle: "italic",
                              color: alpha(theme.palette.text.secondary, 0.8),
                            }}
                          >
                            Преимущества этой услуги пока не указаны.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Компактная навигация "К списку услуг" - зафиксировано внизу экрана для мобильных */}
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 0,
                    mb: isMobile ? 0 : 1,
                    ...(isMobile && {
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      py: 1.5,
                      px: 2,
                      borderRadius: 0,
                      boxShadow: `0 -2px 8px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.95
                      ),
                      backdropFilter: "blur(10px)",
                      borderTop: `1px solid ${alpha(
                        theme.palette.divider,
                        0.1
                      )}`,
                    }),
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/")}
                    startIcon={<ArrowBackIcon sx={{ fontSize: "0.85rem" }} />}
                    size="medium"
                    fullWidth={isMobile}
                    sx={{
                      py: 0.8,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      background: getGradient(),
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}`,
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: getGradient(),
                        boxShadow: `0 6px 16px ${alpha(
                          theme.palette.primary.main,
                          0.35
                        )}`,
                      },
                    }}
                  >
                    К списку всех услуг
                  </Button>
                </Paper>
              </Grid>
            )}

            {/* Десктопная версия с двумя колонками */}
            {!isMobile && (
              <>
                <Grid item xs={12} md={8}>
                  <Fade in={isInView} timeout={800}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, md: 4 },
                        mb: 4,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                        borderRadius: "16px",
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.95
                        ),
                        backdropFilter: "blur(15px)",
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "5px",
                          height: "100%",
                          background: getGradient(),
                        },
                        transform: isInView
                          ? "translateY(0)"
                          : "translateY(40px)",
                        opacity: isInView ? 1 : 0,
                        transition:
                          "all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transitionDelay: "0.2s",
                        boxShadow: `0 10px 30px ${alpha(
                          theme.palette.common.black,
                          0.07
                        )}`,
                      }}
                      className="hover-lift"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      ref={cardRef}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        fontWeight={700}
                        sx={{
                          pl: 2,
                          transform: `perspective(1000px) rotateY(${
                            perspective.x * 5
                          }deg) rotateX(${perspective.y * -5}deg)`,
                          transition: "transform 0.1s ease-out",
                          color: theme.palette.primary.dark,
                        }}
                      >
                        Об услуге
                      </Typography>
                      <Divider
                        sx={{
                          mb: 3,
                          "&::after": {
                            content: '""',
                            display: "block",
                            width: "50px",
                            height: "3px",
                            background: getGradient(),
                            borderRadius: "2px",
                            mt: "-2px",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          mt: 2,
                          "& p": {
                            mb: 2,
                            lineHeight: 1.8,
                            color: theme.palette.text.primary,
                          },
                          "& ul": { mb: 2, pl: 3 },
                          "& li": {
                            mb: 1.5,
                            position: "relative",
                            pl: 2,
                            color: theme.palette.text.primary,
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: -15,
                              top: "10px",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: getGradient(),
                            },
                          },
                          pl: 2,
                          transform: `perspective(1000px) rotateY(${
                            perspective.x * 3
                          }deg) rotateX(${perspective.y * -3}deg)`,
                          transition: "transform 0.1s ease-out",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: service.longDescription,
                        }}
                      />

                      {/* Decorative elements */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          width: 180,
                          height: 180,
                          borderRadius: "50%",
                          background: `radial-gradient(circle, ${alpha(
                            theme.palette.primary.main,
                            0.05
                          )} 0%, transparent 70%)`,
                          zIndex: 0,
                          transform: `perspective(1000px) translateZ(${
                            perspective.y * 50
                          }px) translateX(${perspective.x * -20}px)`,
                          transition: "transform 0.1s ease-out",
                        }}
                      />

                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -30,
                          left: -30,
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          background: getGradient(),
                          opacity: 0.05,
                          zIndex: 0,
                          transform: `perspective(1000px) translateZ(${
                            perspective.y * -30
                          }px) translateX(${perspective.x * 20}px)`,
                          transition: "transform 0.1s ease-out",
                        }}
                      />
                    </Paper>
                  </Fade>

                  <Fade in={isInView} timeout={1000}>
                    <Box
                      sx={{
                        mt: 5,
                        mb: 5,
                        display: "flex",
                        justifyContent: "center",
                        transform: isInView
                          ? "translateY(0)"
                          : "translateY(20px)",
                        opacity: isInView ? 1 : 0,
                        transition: "all 0.7s ease",
                        transitionDelay: "0.4s",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleOrderClick}
                        sx={{
                          mt: 4,
                          minWidth: { xs: "100%", sm: "200px" },
                          py: { xs: 1.5, sm: 1.8 },
                          background:
                            "linear-gradient(45deg, #e85a4f 0%, #ff8a80 100%)",
                          boxShadow: "0 10px 25px rgba(232, 90, 79, 0.3)",
                          borderRadius: "16px",
                          position: "relative",
                          overflow: "hidden",
                          transition:
                            "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 15px 30px rgba(232, 90, 79, 0.5)",
                            "&::before": {
                              left: "100%",
                            },
                          },
                          "&:active": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 15px rgba(232, 90, 79, 0.4)",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
                            transition: "left 0.8s ease",
                            zIndex: 1,
                          },
                        }}
                      >
                        Заказать услугу
                      </Button>
                    </Box>
                  </Fade>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Fade in={isInView} timeout={600}>
                    <Card
                      sx={{
                        position: isTablet ? "relative" : "sticky",
                        top: headerHeight + 24,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                        boxShadow: `0 15px 35px ${alpha(
                          theme.palette.common.black,
                          0.1
                        )}`,
                        borderRadius: "20px",
                        overflow: "hidden",
                        background: `linear-gradient(145deg, ${alpha(
                          theme.palette.background.paper,
                          0.95
                        )} 0%, ${alpha(
                          theme.palette.background.paper,
                          1
                        )} 100%)`,
                        transform: isInView
                          ? "translateY(0)"
                          : "translateY(40px)",
                        opacity: isInView ? 1 : 0,
                        transition:
                          "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        backdropFilter: "blur(20px)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "6px",
                          background: getGradient(),
                          zIndex: 1,
                        },
                      }}
                      className="hover-lift"
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 3, position: "relative" }}>
                          <Typography
                            variant="overline"
                            sx={{
                              fontWeight: 700,
                              letterSpacing: 1.2,
                              background: getGradient(),
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              textFillColor: "transparent",
                              display: "inline-block",
                              fontSize: "0.8rem",
                            }}
                          >
                            Стоимость
                          </Typography>
                          <Typography
                            variant="h3"
                            component="div"
                            fontWeight={800}
                            gutterBottom
                            sx={{
                              mt: 0.5,
                              mb: 0,
                              background: getGradient(),
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              textFillColor: "transparent",
                            }}
                          >
                            {service.price} ₽
                          </Typography>

                          <Chip
                            label="Доступно сейчас"
                            color="success"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              animation: "pulse 2s infinite",
                              backgroundColor: alpha(
                                theme.palette.success.main,
                                0.2
                              ),
                              color: theme.palette.success.dark,
                              border: `1px solid ${alpha(
                                theme.palette.success.main,
                                0.3
                              )}`,
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                            py: 1.5,
                            px: 2,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            ),
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.12
                              ),
                              transform: "translateX(5px)",
                            },
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.05
                            )}`,
                          }}
                        >
                          <AccessTimeIcon
                            fontSize="small"
                            color="primary"
                            sx={{ mr: 1.5 }}
                          />
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="primary.dark"
                          >
                            Длительность: {service.duration}
                          </Typography>
                        </Box>

                        <Divider
                          sx={{
                            my: 3,
                            "&::after": {
                              content: '""',
                              display: "block",
                              width: "30px",
                              height: "3px",
                              background: getGradient(),
                              borderRadius: "2px",
                              mt: "-2px",
                            },
                          }}
                        />

                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{
                            mb: 2,
                            position: "relative",
                            display: "inline-block",
                            color: theme.palette.text.primary,
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: -5,
                              left: 0,
                              width: "50%",
                              height: 2,
                              borderRadius: 1,
                              background: getGradient(),
                            },
                          }}
                        >
                          Что включено:
                        </Typography>

                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          {benefits.map((benefit, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateX(5px)",
                                },
                                p: 1.5,
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                                borderRadius: "8px",
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.05
                                )}`,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 26,
                                  height: 26,
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  ),
                                  color: theme.palette.primary.dark,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.25
                                    ),
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Avatar>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                  mt: 0.3,
                                  lineHeight: 1.6,
                                  fontWeight: 500,
                                }}
                              >
                                {benefit}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          onClick={handleOrderClick}
                          sx={{
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: "12px",
                            mt: 1,
                            mb: 2,
                            boxShadow: `0 8px 20px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                            background: getGradient(),
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: `0 12px 25px ${alpha(
                                theme.palette.primary.main,
                                0.35
                              )}`,
                            },
                            position: "relative",
                            overflow: "hidden",
                            color: "#fff",
                            border: `1px solid ${alpha("#fff", 0.2)}`,
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: "-50%",
                              left: "-60%",
                              width: "200%",
                              height: "200%",
                              opacity: 0,
                              transform: "rotate(30deg)",
                              background: "rgba(255, 255, 255, 0.13)",
                            },
                            "&:hover::after": {
                              opacity: 1,
                              transition: "all 0.7s ease",
                              left: "100%",
                            },
                          }}
                        >
                          Заказать услугу
                        </Button>

                        <Typography
                          variant="caption"
                          color="text.primary"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            opacity: 0.8,
                            fontStyle: "italic",
                            fontWeight: 500,
                          }}
                        >
                          При оформлении заказа вы сможете выбрать удобные дату
                          и время
                        </Typography>

                        {/* Декоративные элементы */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "-40px",
                            right: "-40px",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: getGradient(),
                            opacity: 0.05,
                            zIndex: 0,
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            top: "60%",
                            left: "-20px",
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: getGradient(),
                            opacity: 0.05,
                            zIndex: 0,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              </>
            )}
          </Grid>

          {/* Закрепленная панель с кнопкой заказа для мобильных */}
          {isMobile && (
            <Slide direction="up" in={showMobileActions}>
              <AppBar
                position="fixed"
                color="default"
                sx={{
                  top: "auto",
                  bottom: 0,
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 -2px 8px ${alpha(
                    theme.palette.common.black,
                    0.05
                  )}`,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  height: "54px",
                  display: "flex",
                  justifyContent: "center",
                  zIndex: 1200,
                }}
              >
                <Toolbar
                  sx={{
                    minHeight: "auto",
                    px: 1,
                    py: 0,
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                  disableGutters
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={() => navigate("/")}
                      size="small"
                      startIcon={<ArrowBackIcon sx={{ fontSize: "0.9rem" }} />}
                      sx={{
                        py: 0.5,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      К списку услуг
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          mr: 1.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            mb: -0.3,
                          }}
                        >
                          Стоимость
                        </Typography>
                        <Typography
                          variant="body2"
                          component="div"
                          fontWeight={700}
                          sx={{
                            background: getGradient(),
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: "1rem",
                          }}
                        >
                          {service.price} ₽
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOrderClick}
                        size="small"
                        sx={{
                          py: 0.8,
                          px: 2,
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          background: getGradient(),
                          borderRadius: "8px",
                          boxShadow: `0 3px 8px ${alpha(
                            theme.palette.primary.main,
                            0.25
                          )}`,
                          color: "#fff",
                          position: "relative",
                          overflow: "hidden",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: "-50%",
                            left: "-60%",
                            width: "200%",
                            height: "200%",
                            opacity: 0,
                            transform: "rotate(30deg)",
                            background: `linear-gradient(
                              to right, 
                              rgba(255, 255, 255, 0) 0%,
                              rgba(255, 255, 255, 0.3) 77%,
                              rgba(255, 255, 255, 0.5) 92%,
                              rgba(255, 255, 255, 0) 100%
                            )`,
                          },
                          "&:active::after": {
                            opacity: 1,
                            transition: "all 0.3s ease",
                            left: "100%",
                          },
                        }}
                      >
                        Заказать
                      </Button>
                    </Box>
                  </Box>
                </Toolbar>
              </AppBar>
            </Slide>
          )}

          {/* Индикатор загрузки при смене услуги */}
          {isLoading && isMobile && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: alpha(theme.palette.background.paper, 0.85),
                zIndex: 1300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `conic-gradient(from 0deg, ${serviceColors.from}, ${serviceColors.to}, ${serviceColors.from})`,
                  animation: "spin 1.5s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                  mb: 2,
                  boxShadow: `0 2px 10px ${alpha(serviceColors.accent, 0.5)}`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: serviceColors.text,
                }}
              >
                Загрузка услуги...
              </Typography>
            </Box>
          )}

          {/* Кнопка "Наверх" появляется при скролле */}
          <Box
            sx={{
              position: "fixed",
              bottom: isMobile ? 70 : 20, // Поднимаем выше на мобильных из-за панели действий
              right: 20,
              opacity: isInView ? 1 : 0,
              transform: isInView ? "scale(1)" : "scale(0.8)",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(10px)",
                boxShadow: `0 5px 15px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                width: isMobile ? 48 : 48, // Увеличиваем размер кнопки на мобильных
                height: isMobile ? 48 : 48, // Увеличиваем размер кнопки на мобильных
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: "translateY(-5px)",
                },
              }}
            >
              <ArrowBackIcon
                sx={{
                  transform: "rotate(90deg)",
                  color: theme.palette.primary.main,
                  fontSize: isMobile ? "1.5rem" : "1.5rem", // Увеличиваем размер иконки
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ServicePage;
