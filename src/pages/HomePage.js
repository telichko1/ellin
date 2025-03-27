import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Button,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import ParticlesBackground from "../components/ParticlesBackground";
import ServiceCard from "../components/ServiceCard";
import services from "../data/services";
import useScrollPosition from "../hooks/useScrollPosition";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AnimatedText from "../components/AnimatedText";
import FloatingIcons from "../components/FloatingIcons";

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [headerHeight, setHeaderHeight] = useState(70);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [perspective, setPerspective] = useState({ x: 0, y: 0 });
  const scrollRef = useRef(null);
  const desktopScrollRef = useRef(null);
  const scrollPos = useScrollPosition();
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [scrollIndicator, setScrollIndicator] = useState(true);
  const [cardsRotation, setCardsRotation] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardContainerWidth, setCardContainerWidth] = useState(0);
  const cardRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const servicesRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [startTouchPosition, setStartTouchPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const autoScrollIntervalRef = useRef(null);

  // Инициализация массива для сохранения углов поворота карточек
  useEffect(() => {
    if (!isInitialized) {
      const initialRotations = services.map(() => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 0.5,
      }));
      setCardsRotation(initialRotations);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Находим реальную высоту хедера
    const header =
      document.querySelector("header") ||
      document.querySelector(".MuiAppBar-root");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  // Функция для прокрутки к секции услуг
  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Обработчики 3D трансформации для десктопа
  const handleMouseMove = (e) => {
    setLastInteraction(Date.now());
    if (!containerRef.current || !is3DEnabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setPerspective({ x, y });
  };

  const handleMouseLeave = () => {
    setPerspective({ x: 0, y: 0 });
  };

  // Обработчики карусели
  const handleCardScroll = () => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (container) {
      const scrollPosition = container.scrollLeft;
      // Оптимизируем размеры карточек для более выраженной 3D карусели
      const cardWidth = container.clientWidth * (isMobile ? 0.8 : 0.35);

      const newActiveIndex = Math.round(scrollPosition / cardWidth);

      if (
        newActiveIndex !== activeCardIndex &&
        newActiveIndex >= 0 &&
        newActiveIndex < services.length
      ) {
        setActiveCardIndex(newActiveIndex);

        // Эффект "хлопка" при переходе к новой карточке
        const card = container.querySelector(`.card-${newActiveIndex}`);
        if (card) {
          card.classList.add("card-pop-animation");
          setTimeout(() => {
            card.classList.remove("card-pop-animation");
          }, 300);
        }
      }
    }
  };

  // Для улучшения скролла
  const handleScrollStart = (e) => {
    if (isMobileDevice) {
      const touch = e.touches[0];
      setStartTouchPosition(touch.clientX);
      setIsScrolling(true);

      // Останавливаем автоматическую прокрутку когда пользователь касается экрана
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }
  };

  const handleScrollMove = (e) => {
    if (!isDragging) return;

    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (!container) return;

    const x = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    const walk = (x - startX) * 3; // Увеличиваем множитель для более плавной прокрутки
    container.scrollLeft = scrollLeft - walk;

    // Обновляем активную карточку при перетаскивании
    handleCardScroll();
  };

  const handleScrollEnd = () => {
    setIsDragging(false);

    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (container) {
      const cardWidth = container.clientWidth * (isMobile ? 0.8 : 0.35);
      const targetIndex = Math.round(container.scrollLeft / cardWidth);

      // Убедимся, что индекс в допустимых пределах
      const safeIndex = Math.max(0, Math.min(targetIndex, services.length - 1));

      // Плавная анимация к центру выбранной карточки с эффектом пружины
      container.scrollTo({
        left: safeIndex * cardWidth,
        behavior: "smooth",
      });

      setActiveCardIndex(safeIndex);
    }
  };

  // Автоматическая прокрутка карточек
  useEffect(() => {
    // Если пользователь не взаимодействовал с каруселью более 10 секунд, включаем автоматическую прокрутку
    const autoScrollCheckInterval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction > 10000 && !autoScrollActive) {
        setAutoScrollActive(true);
      }
    }, 2000);

    return () => clearInterval(autoScrollCheckInterval);
  }, [lastInteraction, autoScrollActive]);

  // Выполняем автоматическую прокрутку
  useEffect(() => {
    if (!autoScrollActive) return;

    const autoScrollInterval = setInterval(() => {
      const container = isMobile ? scrollRef.current : desktopScrollRef.current;
      if (!container) return;

      const nextIndex = (activeCardIndex + 1) % services.length;
      const cardWidth = container.clientWidth * (isMobile ? 0.8 : 0.35);

      container.scrollTo({
        left: nextIndex * cardWidth,
        behavior: "smooth",
      });

      setActiveCardIndex(nextIndex);
    }, 5000);

    return () => clearInterval(autoScrollInterval);
  }, [autoScrollActive, activeCardIndex, isMobile, services.length]);

  // Рассчитываем высоту основного контейнера
  const containerHeight = "100vh";

  // Хук для создания эффекта 3D вращения на основе положения мыши
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMoveGlobal = (e) => {
    setLastInteraction(Date.now());
    if (!is3DEnabled) return;

    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Нормализуем позицию мыши относительно центра экрана
    const normalizedX = (clientX / windowWidth - 0.5) * 2;
    const normalizedY = (clientY / windowHeight - 0.5) * 2;

    setMousePosition({ x: normalizedX, y: normalizedY });
  };

  // Эффект дыхания для карточек (легкое колебание)
  useEffect(() => {
    if (!isInitialized) return;

    const breathingInterval = setInterval(() => {
      setCardsRotation((prevRotations) =>
        prevRotations.map((rotation, index) => {
          // Случайное отклонение для каждой карточки
          const deltaX =
            (Math.random() * 0.4 - 0.2) * (index === activeCardIndex ? 0.2 : 1);
          const deltaY =
            (Math.random() * 0.4 - 0.2) * (index === activeCardIndex ? 0.2 : 1);

          return {
            x: rotation.x + deltaX,
            y: rotation.y + deltaY,
            z: rotation.z,
          };
        })
      );
    }, 2000);

    return () => clearInterval(breathingInterval);
  }, [activeCardIndex, isInitialized]);

  // Отключаем 3D эффект при скролле
  useEffect(() => {
    if (scrollPos > 50) {
      setIs3DEnabled(false);
    } else {
      setIs3DEnabled(true);
    }
  }, [scrollPos]);

  // Скрываем индикатор скролла после первой прокрутки
  useEffect(() => {
    if (scrollPos > 20) {
      setScrollIndicator(false);
    }
  }, [scrollPos]);

  // Обработка прокрутки для определения активной карточки
  useEffect(() => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      handleCardScroll();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeCardIndex, isMobile]);

  // Автопрокрутка при загрузке
  useEffect(() => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (!container) return;

    // После загрузки, плавно прокручиваем к первой карточке
    setTimeout(() => {
      if (container) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 500);

    // Анимируем индикатор скролла
    const interval = setInterval(() => {
      if (scrollIndicator && container) {
        const currentScroll = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // Если скролл уже в конце, останавливаем анимацию
        if (currentScroll >= maxScroll * 0.3) {
          setScrollIndicator(false);
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollIndicator]);

  // Добавляем функции для управления прокруткой с помощью стрелок
  const handlePrevCard = () => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (!container) return;

    // Выбираем предыдущий индекс, минимум 0
    const newIndex = Math.max(0, activeCardIndex - 1);
    // Правильно рассчитываем ширину карточки, учитывая отступы
    const cardWidth = container.clientWidth * (isMobile ? 0.8 : 0.35);

    // Программно прокручиваем до карточки
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    // Обновляем активный индекс принудительно
    setActiveCardIndex(newIndex);
    setLastInteraction(Date.now());
    setAutoScrollActive(false);

    // Принудительно обновляем UI
    setTimeout(() => {
      handleCardScroll();
    }, 100);
  };

  const handleNextCard = () => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (!container) return;

    // Выбираем следующий индекс, максимум - последняя карточка
    const newIndex = Math.min(services.length - 1, activeCardIndex + 1);
    // Правильно рассчитываем ширину карточки
    const cardWidth = container.clientWidth * (isMobile ? 0.8 : 0.35);

    // Программно прокручиваем до карточки
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    // Обновляем активный индекс принудительно
    setActiveCardIndex(newIndex);
    setLastInteraction(Date.now());
    setAutoScrollActive(false);

    // Принудительно обновляем UI
    setTimeout(() => {
      handleCardScroll();
    }, 100);
  };

  // Улучшаем расчет стилей карточек
  const calculateCardStyle = (index) => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // Оптимизированные отступы для улучшенного центрирования
    const horizontalMargin = isMobile ? 3 : isTablet ? 10 : 15;
    // Уменьшаем вертикальный отступ сверху для мобильных устройств, чтобы поднять карточки
    const verticalMargin = isMobile ? 5 : isTablet ? 10 : 5;

    // Улучшенные размеры карточек для адаптивности и центрирования
    const baseStyle = {
      margin: isMobile
        ? `${verticalMargin}px ${horizontalMargin}px 30px`
        : `${verticalMargin}px ${horizontalMargin}px 20px`,
      height: isMobile ? "340px" : isTablet ? "370px" : "390px",
      width: isMobile ? "calc(85vw - 40px)" : isTablet ? "320px" : "340px",
      maxWidth: isMobile ? "280px" : "none",
      flexShrink: 0,
      position: "relative",
      transformOrigin: "center center",
      transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      scrollSnapAlign: "center",
    };

    if (isMobileDevice) {
      // Стиль для мобильных устройств с оптимизированным центрированием
      return {
        ...baseStyle,
        opacity: index === activeCardIndex ? 1 : 0.7,
        transform:
          index === activeCardIndex
            ? "scale(1) translateZ(5px)" // Небольшое поднятие активной карточки
            : index < activeCardIndex
            ? "scale(0.92) translateX(-3%) translateZ(-10px)" // Меньше смещение
            : "scale(0.92) translateX(3%) translateZ(-10px)", // Меньше смещение
        filter:
          index === activeCardIndex ? "none" : "brightness(0.9) blur(0.5px)",
        zIndex: index === activeCardIndex ? 10 : 5,
      };
    } else {
      // Стиль для десктопа с улучшенным 3D эффектом и центрированием
      return {
        ...baseStyle,
        opacity: index === activeCardIndex ? 1 : 0.85,
        transform:
          index === activeCardIndex
            ? "scale(1) translateZ(20px) rotateY(0deg)" // Увеличиваем выступление активной карточки
            : index < activeCardIndex
            ? `scale(0.92) translateZ(-30px) rotateY(${
                isMobile ? 3 : 8
              }deg) translateX(-3%)` // Уменьшаем отклонение для лучшего центрирования
            : `scale(0.92) translateZ(-30px) rotateY(-${
                isMobile ? 3 : 8
              }deg) translateX(3%)`, // Уменьшаем отклонение для лучшего центрирования
        filter: index === activeCardIndex ? "none" : "brightness(0.9)",
        zIndex: index === activeCardIndex ? 10 : 5,
      };
    }
  };

  // Рендеринг индикаторов для карусели
  const renderCarouselIndicators = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
      <Box
        className="mobile-carousel-indicator"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "8px" : "12px",
          position: "absolute",
          bottom: isMobile ? "10px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          padding: "8px 14px",
          borderRadius: "20px",
          background: alpha(theme.palette.background.paper, 0.2),
          backdropFilter: "blur(5px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
          transition: "all 0.3s ease",
          width: "auto",
          maxWidth: "80%",
        }}
      >
        {services.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveCardIndex(index)}
            className={index === activeCardIndex ? "active" : ""}
            sx={{
              width: isMobile ? "10px" : "12px",
              height: isMobile ? "10px" : "12px",
              borderRadius: "50%",
              backgroundColor:
                index === activeCardIndex
                  ? theme.palette.primary.main
                  : alpha(theme.palette.grey[400], 0.5),
              transition: "all 0.3s ease",
              cursor: "pointer",
              transform: index === activeCardIndex ? "scale(1.2)" : "scale(1)",
              opacity: index === activeCardIndex ? 1 : 0.6,
              boxShadow:
                index === activeCardIndex
                  ? `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`
                  : "none",
              "&:hover": {
                backgroundColor:
                  index === activeCardIndex
                    ? theme.palette.primary.main
                    : alpha(theme.palette.grey[400], 0.8),
                transform: "scale(1.1)",
              },
            }}
          />
        ))}
      </Box>
    );
  };

  // Обновляем renderPageCounter для использования новых классов
  const renderPageCounter = () => {
    return (
      <Box
        className="page-counter"
        sx={{
          position: "absolute",
          top: -35,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          px: 2,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: alpha(theme.palette.text.primary, 0.6),
        }}
      >
        <Box
          component="span"
          className="current"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          {activeCardIndex + 1}
        </Box>
        <Box component="span" sx={{ opacity: 0.8 }}>
          /
        </Box>
        <Box component="span">{services.length}</Box>
      </Box>
    );
  };

  useEffect(() => {
    const container = isMobile ? scrollRef.current : desktopScrollRef.current;
    if (container) {
      setCardWidth(container.clientWidth * (isMobile ? 0.8 : 0.35));
      setCardContainerWidth(container.clientWidth);
    }
  }, [isMobile]);

  useEffect(() => {
    setIsMobileDevice(isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        mt: `${headerHeight}px`,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseMove={handleMouseMoveGlobal}
    >
      {/* Фон с частицами */}
      <ParticlesBackground variant="default" />

      {/* Секция приветствия */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          pb: 5,
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{
            px: { xs: 2, sm: 3, md: 5 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Grid item xs={12} md={10} lg={8}>
            <Box
              className="hero-content"
              sx={{ position: "relative", zIndex: 5 }}
            >
              <Typography
                variant="h2"
                component="h1"
                className="fade-in"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", sm: "2.5rem", md: "3.2rem" },
                  mb: 2,
                  background:
                    "linear-gradient(45deg, #e85a4f 30%, #ff8a80 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  textShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                EllinPrincess
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                className="fade-in-delay-1"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.7rem" },
                  color: alpha("#333", 0.85),
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                Премиальное сопровождение для особых моментов
              </Typography>

              <Box className="fade-in-delay-2">
                <AnimatedText
                  texts={[
                    "Девушка мечты. Она именно та, с которой хочется все и ничего одновременно. С ней ты не будешь чувствовать себя одиноким",
                    "Сопровождение на значимых мероприятиях",
                    "Индивидуальные встречи и общение",
                    "Конфиденциальность и уважение",
                  ]}
                  variant="h6"
                  color={alpha(theme.palette.text.primary, 0.75)}
                  sx={{ mb: 4, height: "120px", fontWeight: 500 }}
                  typingSpeed={50}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: 2, sm: 3 },
                  flexWrap: "wrap",
                  mb: { xs: 5, md: 3 },
                }}
                className="fade-in-delay-3"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={scrollToServices}
                  sx={{
                    py: { xs: 1.3, md: 1.5 },
                    px: { xs: 3, md: 4 },
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    borderRadius: "12px",
                    fontWeight: 600,
                    background:
                      "linear-gradient(45deg, #e85a4f 10%, #ff8a80 90%)",
                    boxShadow: "0px 8px 20px rgba(232, 90, 79, 0.25)",
                    transition: "all 0.3s ease",
                    textTransform: "none",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 12px 25px rgba(232, 90, 79, 0.35)",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover::after": {
                      opacity: 1,
                    },
                  }}
                >
                  Посмотреть услуги
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Декоративные элементы */}
        <FloatingIcons />

        {/* Индикатор скролла вниз */}
        <Box
          className="scroll-down-indicator"
          onClick={scrollToServices}
          sx={{
            position: "absolute",
            bottom: { xs: 20, md: 40 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            opacity: 0.7,
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
            animation: "fadeInOut 2s ease-in-out infinite",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              fontWeight: 500,
              color: alpha(theme.palette.text.primary, 0.6),
            }}
          >
            Листай вниз
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: theme.palette.primary.main,
              animation: "bounce 2s infinite",
            }}
          />
        </Box>
      </Container>

      {/* Разделитель между секциями */}
      <Divider
        sx={{
          my: 0,
          borderColor: alpha(theme.palette.divider, 0.1),
          width: "80%",
          mx: "auto",
        }}
      />

      {/* Секция услуг */}
      <Container
        maxWidth={false}
        disableGutters
        ref={servicesRef}
        sx={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          // Уменьшаем верхний отступ для поднятия карточек
          mt: { xs: 0, md: 2 },
          mb: { xs: 2, md: 3 },
          px: 0,
          perspectiveOrigin: "center center",
          perspective: "1000px",
          // Уменьшаем вертикальные отступы для компактности
          py: { xs: 1, md: 2 },
        }}
      >
        {/* Заголовок секции */}
        <Typography
          variant="h3"
          component="h2"
          align="center"
          className="fade-in"
          sx={{
            fontWeight: 800,
            mb: { xs: 3, md: 4 },
            background:
              "linear-gradient(90deg, #333333 0%, #e85a4f 50%, #333333 100%)",
            backgroundSize: "200% auto",
            color: "transparent",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            textFillColor: "transparent",
            animation: "gradientAnimation 6s ease infinite",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            px: 2,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #e85a4f 0%, #ff8a80 100%)",
              borderRadius: "3px",
            },
          }}
        >
          Наши услуги
        </Typography>

        {/* Контейнер для карточек с кнопками навигации */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Стрелки для десктопной навигации */}
          {!isMobile && (
            <>
              <IconButton
                aria-label="Предыдущая карточка"
                onClick={handlePrevCard}
                disabled={activeCardIndex === 0}
                className="carousel-arrow-button carousel-arrow-left"
                sx={{
                  position: "absolute",
                  left: { sm: 10, md: 20 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1000, // Увеличиваем z-index для уверенности
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.common.black,
                    0.15
                  )}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  width: { sm: 40, md: 48 },
                  height: { sm: 40, md: 48 },
                  opacity: activeCardIndex === 0 ? 0.5 : 1,
                  // Добавляем курсор поинтер для всех кнопок
                  cursor: activeCardIndex === 0 ? "not-allowed" : "pointer",
                }}
              >
                <KeyboardArrowLeftIcon fontSize="medium" color="primary" />
              </IconButton>

              <IconButton
                aria-label="Следующая карточка"
                onClick={handleNextCard}
                disabled={activeCardIndex === services.length - 1}
                className="carousel-arrow-button carousel-arrow-right"
                sx={{
                  position: "absolute",
                  right: { sm: 10, md: 20 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1000, // Увеличиваем z-index для уверенности
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${alpha(theme.palette.common.white, 0.5)}`,
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.common.black,
                    0.15
                  )}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  width: { sm: 40, md: 48 },
                  height: { sm: 40, md: 48 },
                  opacity: activeCardIndex === services.length - 1 ? 0.5 : 1,
                  // Добавляем курсор поинтер для всех кнопок
                  cursor:
                    activeCardIndex === services.length - 1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <KeyboardArrowRightIcon fontSize="medium" color="primary" />
              </IconButton>
            </>
          )}

          {/* Контейнер для карточек с улучшенными 3D эффектами */}
          <Box
            className={
              isMobile ? "mobile-scroll-container" : "desktop-scroll-container"
            }
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              position: "relative",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
              scrollPadding: isMobile ? "0 5%" : "0 15%",
              pb: 5,
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Уменьшаем высоту контейнера для мобильной версии
              height: { xs: "360px", sm: "450px", md: "480px" },
              transformStyle: "preserve-3d",
              perspective: "1500px",
              mb: { xs: 2, md: 2 },
              px: isMobile ? 1 : 0,
              margin: "0 auto",
              // Подняли карточки выше для мобильной версии
              mt: isMobile ? -2 : 0,
            }}
            ref={isMobile ? scrollRef : desktopScrollRef}
            onScroll={handleCardScroll}
            onMouseDown={(e) => {
              // Для десктопной версии инициализируем перетаскивание
              if (!isMobile) {
                setIsDragging(true);
                setStartX(e.pageX);
                setScrollLeft(e.currentTarget.scrollLeft);
              }
            }}
            onMouseMove={handleScrollMove}
            onMouseUp={handleScrollEnd}
            onMouseLeave={handleScrollEnd}
            onTouchStart={handleScrollStart}
            onTouchMove={handleScrollMove}
            onTouchEnd={handleScrollEnd}
          >
            <Box
              sx={{
                display: "flex",
                minWidth: isMobile ? "auto" : "100%",
                pl: isMobile
                  ? { xs: "20%", sm: "20%" }
                  : { xs: "25%", md: "25%" },
                pr: isMobile
                  ? { xs: "20%", sm: "20%" }
                  : { xs: "25%", md: "25%" },
                py: 2,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                height: "100%",
                transformStyle: "preserve-3d",
                gap: isMobile ? 1.2 : 2,
                margin: "0 auto",
              }}
            >
              {services.map((service, index) => (
                <Box
                  key={service.id}
                  className={`${
                    isMobile ? "mobile-scroll-item" : "desktop-scroll-item"
                  } card-${index} ${index === activeCardIndex ? "active" : ""}`}
                  sx={{
                    flex: "0 0 auto",
                    width: isMobile ? "280px" : { sm: "320px", md: "350px" },
                    height: "100%",
                    px: isMobile ? 0 : 1,
                    scrollSnapAlign: "center",
                    ...calculateCardStyle(index),
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                    mx: isMobile ? 1 : 1.8,
                    boxSizing: "border-box",
                  }}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <ServiceCard
                    service={service}
                    isActive={index === activeCardIndex}
                    delay={0.1 * index}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Индикаторы карусели с улучшенным дизайном */}
          {renderCarouselIndicators()}

          {/* Счетчик страниц */}
          {!isMobile && renderPageCounter()}
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
