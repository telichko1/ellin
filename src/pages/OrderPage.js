import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  IconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  useTheme,
  Backdrop,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  alpha,
  Avatar,
  Stack,
  Tooltip,
  Chip,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EastIcon from "@mui/icons-material/East";
import axios from "axios";
import services from "../data/services";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { QRCodeSVG as QRCode } from "qrcode.react";

const steps = [
  "Выбор даты и времени",
  "Контактная информация",
  "Подтверждение и оплата",
];

const stepsIcons = [<EventNoteIcon />, <PersonIcon />, <PaymentIcon />];

function getFormattedDate(date) {
  return date ? date.toISOString().split("T")[0] : "";
}

function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [service, setService] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(70);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const fileInputRef = React.useRef(null);

  // Находим реальную высоту хедера при загрузке страницы
  useEffect(() => {
    const header =
      document.querySelector("header") ||
      document.querySelector(".MuiAppBar-root");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    // Прокрутка страницы вверх при загрузке
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const foundService = services.find((s) => s.id === parseInt(id));

    if (foundService) {
      setService(foundService);
      document.title = `Заказ услуги: ${foundService.title}`;
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      const formattedDate = getFormattedDate(selectedDate);

      // Имитация получения данных вместо реального API запроса
      const mockTimeSlots = [
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
      ];

      setTimeout(() => {
        setAvailableTimeSlots(mockTimeSlots);
        setLoading(false);
      }, 500);
    }
  }, [selectedDate]);

  if (!service) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleNext = () => {
    if (activeStep === 0 && (!selectedDate || !selectedTime)) {
      setError("Пожалуйста, выберите дату и время.");
      return;
    }

    if (activeStep === 1 && (!name || !telegramUsername)) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    if (activeStep === 2) {
      // Open payment dialog
      setPaymentDialogOpen(true);
      return;
    }

    setError("");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    // Плавная прокрутка вверх после перехода к следующему шагу
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

    // Плавная прокрутка вверх после перехода к предыдущему шагу
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPaymentScreenshot(file);

      // Показать краткое уведомление об успешной загрузке
      setError("");
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentConfirm = async () => {
    if (!paymentScreenshot && paymentMethod === "card") {
      setError("Пожалуйста, загрузите скриншот оплаты.");
      return;
    }

    setLoading(true);
    setError("");

    // Имитация отправки данных вместо реального API запроса
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPaymentComplete(true);
      setPaymentDialogOpen(false);

      // Navigate to success page after a short delay
      setTimeout(() => {
        navigate("/success", {
          state: {
            serviceId: service.id,
            serviceName: service.title,
            date: selectedDate ? selectedDate.toLocaleDateString("ru-RU") : "",
            time: selectedTime,
            price: service.price,
            name: name,
            telegramUsername: telegramUsername,
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              fontWeight={600}
              className="service-title"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                mb: { xs: 1.5, md: 2 },
              }}
            >
              Выберите удобную дату и время
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              }}
            >
              Укажите предпочтительную дату и время для вашего заказа.
              {isMobile && " Свайпайте календарь для просмотра других месяцев."}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ru}
                >
                  <DatePicker
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    disablePast
                    sx={{
                      width: "100%",
                      maxWidth: { xs: "100%", md: "350px" },
                      mx: "auto",
                      "& .MuiPickersDay-root": {
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                        width: { xs: "32px", md: "40px" },
                        height: { xs: "32px", md: "40px" },
                        margin: { xs: "2px", md: "3px" },
                      },
                      "& .MuiDayCalendar-header": {
                        "& .MuiDayCalendar-weekDayLabel": {
                          fontSize: { xs: "0.7rem", md: "0.8rem" },
                          width: { xs: "32px", md: "40px" },
                          height: { xs: "32px", md: "40px" },
                        },
                      },
                      "& .MuiPickersCalendarHeader-label": {
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      },
                      "& .MuiPickersCalendarHeader-switchViewButton": {
                        width: { xs: "28px", md: "32px" },
                        height: { xs: "28px", md: "32px" },
                      },
                      "& .MuiPickersArrowSwitcher-button": {
                        padding: { xs: "4px", md: "8px" },
                      },
                      "& .MuiYearCalendar-root": {
                        "& .MuiPickersYear-yearButton": {
                          fontSize: { xs: "0.8rem", md: "1rem" },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: "15px",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: alpha(theme.palette.background.paper, 0.6),
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    gutterBottom
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    Выбранная дата:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    fontWeight={500}
                    gutterBottom
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {selectedDate
                      ? getFormattedDate(selectedDate)
                      : "Дата не выбрана"}
                  </Typography>

                  <Box
                    sx={{
                      mt: { xs: 2, md: 3 },
                      mb: { xs: 1, md: 2 },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      gutterBottom
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      Выберите время:
                    </Typography>

                    {isMobile ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => {
                            const hours = selectedTime
                              ? parseInt(selectedTime.split(":")[0])
                              : 12;
                            const mins = selectedTime
                              ? parseInt(selectedTime.split(":")[1])
                              : 0;
                            const newHours = hours > 9 ? hours - 1 : 23;
                            setSelectedTime(
                              `${newHours}:${mins < 10 ? "0" + mins : mins}`
                            );
                          }}
                          sx={{
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                            mr: 1,
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Typography
                          variant="h6"
                          sx={{
                            mx: 2,
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {selectedTime || "12:00"}
                        </Typography>

                        <IconButton
                          color="primary"
                          onClick={() => {
                            const hours = selectedTime
                              ? parseInt(selectedTime.split(":")[0])
                              : 12;
                            const mins = selectedTime
                              ? parseInt(selectedTime.split(":")[1])
                              : 0;
                            const newHours = hours < 23 ? hours + 1 : 9;
                            setSelectedTime(
                              `${newHours}:${mins < 10 ? "0" + mins : mins}`
                            );
                          }}
                          sx={{
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                            ml: 1,
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        sx={{
                          mt: 1,
                          "& .MuiInputBase-root": {
                            borderRadius: "10px",
                          },
                        }}
                      >
                        {[
                          "9:00",
                          "10:00",
                          "11:00",
                          "12:00",
                          "13:00",
                          "14:00",
                          "15:00",
                          "16:00",
                          "17:00",
                          "18:00",
                          "19:00",
                          "20:00",
                          "21:00",
                          "22:00",
                          "23:00",
                        ].map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              Ваши контактные данные
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              }}
            >
              Укажите данные для связи. Мы свяжемся с вами для подтверждения
              заказа.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  variant="outlined"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{
                    mb: { xs: 1.5, md: 2 },
                    "& .MuiInputBase-root": {
                      borderRadius: "10px",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telegram"
                  variant="outlined"
                  name="telegram"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  required
                  placeholder="@username"
                  sx={{
                    mb: { xs: 1.5, md: 2 },
                    "& .MuiInputBase-root": {
                      borderRadius: "10px",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Дополнительная информация"
                  variant="outlined"
                  name="notes"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  multiline
                  rows={isMobile ? 3 : 4}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "10px",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: { xs: 2, md: 3 },
                p: { xs: 1.5, md: 2 },
                borderRadius: "10px",
                bgcolor: alpha(theme.palette.warning.light, 0.15),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                }}
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.warning.main }}
                />
                Обратите внимание, что для подтверждения заказа требуется
                предоплата. Детали оплаты вы сможете указать на следующем шаге.
              </Typography>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              Подтверждение заказа
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              }}
            >
              Проверьте детали вашего заказа и подтвердите.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                mb: { xs: 2, md: 3 },
                borderRadius: "15px",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    fontWeight={700}
                    sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                  >
                    {service.title}
                  </Typography>
                  <Divider sx={{ my: { xs: 1, md: 1.5 } }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                  >
                    Дата
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {selectedDate
                      ? getFormattedDate(selectedDate)
                      : "Не выбрана"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                  >
                    Время
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {selectedTime || "Не выбрано"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                  >
                    Имя
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {name || "Не указано"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                  >
                    Telegram
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {telegramUsername || "Не указан"}
                  </Typography>
                </Grid>

                {telegramUsername && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                    >
                      Дополнительная информация
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      {telegramUsername}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "stretch" : "center",
                p: { xs: 2, md: 3 },
                borderRadius: "15px",
                bgcolor: alpha(theme.palette.primary.light, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Итоговая стоимость:
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                >
                  {service.price} ₽
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setPaymentDialogOpen(true)}
                startIcon={<PaymentIcon />}
                sx={{
                  mt: isMobile ? 2 : 0,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.2 },
                  borderRadius: "10px",
                  fontWeight: 600,
                  boxShadow: `0 6px 16px ${alpha(
                    theme.palette.primary.main,
                    0.25
                  )}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 10px 20px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Оплатить заказ
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
        mt: `${headerHeight + (isMobile ? 8 : 16)}px`,
      }}
    >
      <Fade in={true} timeout={400}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: { xs: 2, md: 4 },
            flexWrap: "wrap",
            gap: { xs: 0.5, md: 1 },
          }}
        >
          <Tooltip title="Вернуться назад">
            <IconButton
              color="primary"
              onClick={() => navigate(-1)}
              sx={{
                mr: { xs: 1, md: 1.5 },
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            sx={{
              flexGrow: 1,
              fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2.2rem" },
            }}
          >
            <span className="text-gradient">Оформление заказа</span>
          </Typography>

          <Chip
            label={`${service.price} ₽`}
            color="primary"
            sx={{
              fontWeight: 700,
              borderRadius: "8px",
              p: { xs: 0.3, md: 0.5 },
              "& .MuiChip-label": {
                px: { xs: 0.7, md: 1 },
                fontSize: { xs: "0.75rem", md: "0.875rem" },
              },
            }}
          />
        </Box>
      </Fade>

      <Grid container spacing={isTablet ? 2 : 3}>
        {isMobile && (
          <Grid item xs={12}>
            <Fade in={true} timeout={800}>
              <Card
                className="order-form-container"
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight={600}
                    gutterBottom
                    className="service-title"
                    sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    className="service-description"
                    sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                  >
                    {service.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="primary"
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      {service.price} ₽
                    </Typography>
                    <Chip
                      label={service.duration}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        background: alpha(theme.palette.primary.main, 0.1),
                        transition: "all 0.3s ease",
                        height: { xs: "24px", md: "32px" },
                        "& .MuiChip-label": {
                          fontSize: { xs: "0.7rem", md: "0.75rem" },
                        },
                        "&:hover": {
                          background: alpha(theme.palette.primary.main, 0.15),
                          transform: "translateY(-2px)",
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        )}

        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={600}>
            <Paper
              elevation={2}
              className="order-form-container"
              sx={{
                p: { xs: 2, sm: 2.5, md: 4 },
                mt: { xs: 1, md: 4 },
                mb: { xs: 2, md: 4 },
                maxWidth: "800px",
                mx: "auto",
                position: "relative",
                transform: "translateY(0)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Stepper
                activeStep={activeStep}
                sx={{
                  py: { xs: 1.5, md: 3 },
                }}
                alternativeLabel={isMobile}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      className={
                        activeStep === index ? "order-step-active" : ""
                      }
                      sx={{
                        transition: "all 0.3s ease",
                        "& .MuiStepLabel-label": {
                          transition: "all 0.3s ease",
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                        },
                        "&.order-step-active .MuiStepLabel-label": {
                          fontWeight: "600 !important",
                          color: "#E85A4F !important",
                        },
                        "& .MuiStepIcon-root": {
                          fontSize: { xs: "1.2rem", md: "1.5rem" },
                        },
                      }}
                    >
                      {!isMobile && label}
                      {isMobile && index === activeStep && label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    boxShadow: `0 6px 12px ${alpha(
                      theme.palette.error.main,
                      0.08
                    )}`,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ px: { xs: 0, md: 2 } }}>
                {renderStepContent(activeStep)}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: { xs: 3, md: 4 },
                    pt: { xs: 1.5, md: 2 },
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  {activeStep > 0 ? (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        borderRadius: "10px",
                        py: { xs: 0.8, md: 1.2 },
                        px: { xs: 1.5, md: 3 },
                        borderWidth: "2px",
                        fontSize: { xs: "0.8rem", md: "0.875rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderWidth: "2px",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Назад
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        borderRadius: "10px",
                        py: { xs: 0.8, md: 1.2 },
                        px: { xs: 1.5, md: 3 },
                        borderWidth: "2px",
                        fontSize: { xs: "0.8rem", md: "0.875rem" },
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderWidth: "2px",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Отмена
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className="service-button"
                    sx={{
                      mt: { xs: 0, md: 2 },
                      px: { xs: 2, md: 4 },
                      py: { xs: 0.8, md: 1.2 },
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
                      fontWeight: 600,
                      transition:
                        "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 20px rgba(232, 90, 79, 0.2)",
                      },
                    }}
                  >
                    {activeStep === steps.length - 1 ? "Завершить" : "Далее"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={4}>
            <Fade in={true} timeout={800}>
              <Card
                className="order-form-container"
                sx={{
                  mb: 3,
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight={600}
                    gutterBottom
                    className="service-title"
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    className="service-description"
                  >
                    {service.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color="primary"
                    >
                      {service.price} ₽
                    </Typography>
                    <Chip
                      label={service.duration}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        background: alpha(theme.palette.primary.main, 0.1),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: alpha(theme.palette.primary.main, 0.15),
                          transform: "translateY(-2px)",
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? "0" : "20px",
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: { xs: 2, md: 3 },
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          <PaymentIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          Оплата заказа
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
            <FormLabel
              component="legend"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              Способ оплаты
            </FormLabel>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1, md: 2 },
              }}
            >
              <Paper
                component={FormControlLabel}
                value="card"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                    >
                      Банковская карта
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  p: { xs: 1, md: 1.5 },
                  px: { xs: 1.5, md: 2 },
                  minWidth: { xs: "100%", md: "180px" },
                  borderRadius: "12px",
                  border: `1px solid ${
                    paymentMethod === "card"
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.7)
                  }`,
                  backgroundColor:
                    paymentMethod === "card"
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                  transition: "all 0.2s",
                }}
              />

              <Paper
                component={FormControlLabel}
                value="crypto"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                    >
                      Криптовалюта
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  p: { xs: 1, md: 1.5 },
                  px: { xs: 1.5, md: 2 },
                  minWidth: { xs: "100%", md: "180px" },
                  borderRadius: "12px",
                  border: `1px solid ${
                    paymentMethod === "crypto"
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.7)
                  }`,
                  backgroundColor:
                    paymentMethod === "crypto"
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                  transition: "all 0.2s",
                }}
              />
            </RadioGroup>
          </FormControl>

          {paymentMethod === "card" && (
            <>
              <Box
                sx={{
                  mb: 3,
                  p: { xs: 2, md: 3 },
                  borderRadius: "15px",
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  Реквизиты для оплаты
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    mt: 2,
                    p: { xs: 1.5, md: 2 },
                    borderRadius: "10px",
                    border: `1px dashed ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      mb: { xs: 1, md: 0 },
                    }}
                  >
                    <CreditCardIcon
                      fontSize="small"
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    4988 4388 5422 8976
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigator.clipboard.writeText("4988438854228976")
                    }
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    sx={{
                      borderRadius: "8px",
                      fontSize: { xs: "0.75rem", md: "0.8rem" },
                      p: { xs: 0.5, md: 0.7 },
                      px: { xs: 1, md: 1.5 },
                    }}
                  >
                    Копировать
                  </Button>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
                  }}
                >
                  Пожалуйста, переведите сумму {service.price} ₽ на указанную
                  карту и сделайте скриншот подтверждения платежа.
                </Typography>
              </Box>

              <FormControl
                component="fieldset"
                sx={{ width: "100%", mb: { xs: 1, md: 2 } }}
              >
                <FormLabel
                  component="legend"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  }}
                >
                  Скриншот платежа
                </FormLabel>

                {paymentScreenshot ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: "180px", sm: "220px", md: "260px" },
                        backgroundImage: `url(${paymentScreenshot})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "10px",
                        mb: 1,
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          0.2
                        )}`,
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.common.black,
                          0.05
                        )}`,
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setPaymentScreenshot(null)}
                      startIcon={<DeleteIcon />}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        mt: 1,
                        borderRadius: "8px",
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                      }}
                    >
                      Удалить и загрузить другой
                    </Button>
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: "12px",
                      border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.5
                      ),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      height: { xs: "160px", md: "200px" },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.8
                        ),
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <CloudUploadIcon
                      color="primary"
                      sx={{
                        fontSize: { xs: 40, md: 52 },
                        mb: 1,
                        opacity: 0.8,
                      }}
                    />
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      Загрузить скриншот оплаты
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{
                        mt: 1,
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                      }}
                    >
                      Нажмите здесь или перетащите файл
                    </Typography>
                  </Paper>
                )}
              </FormControl>
            </>
          )}

          {paymentMethod === "crypto" && (
            <Box
              sx={{
                mb: 3,
                p: { xs: 2, md: 3 },
                borderRadius: "15px",
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Оплата криптовалютой
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 2,
                  p: { xs: 1.5, md: 2 },
                  borderRadius: "10px",
                  border: `1px dashed ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    p: 2,
                    borderRadius: "8px",
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    mb: 1.5,
                  }}
                >
                  <QRCode
                    value="0x8f5a2bDa18E38dC53A7687d05f21c36Fa0e08913"
                    renderAs="svg"
                    size={isMobile ? 160 : 200}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mt: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    0x8f5a2bDa18E38dC53A7687d05f21c36Fa0e08913
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        "0x8f5a2bDa18E38dC53A7687d05f21c36Fa0e08913"
                      )
                    }
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    sx={{
                      ml: 1,
                      borderRadius: "8px",
                      fontSize: { xs: "0.75rem", md: "0.8rem" },
                      p: { xs: 0.5, md: 0.7 },
                      px: { xs: 1, md: 1.5 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Копировать
                  </Button>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "text.secondary",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                }}
              >
                Отправьте эквивалент {service.price} ₽ в USDT (TRC-20) на
                указанный адрес. После отправки нажмите кнопку "Подтвердить".
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, md: 3 },
            pt: 0,
            flexDirection: { xs: "column", md: "row" },
            "& .MuiButton-root": {
              width: { xs: "100%", md: "auto" },
              mb: { xs: 1, md: 0 },
            },
          }}
        >
          <Button
            onClick={() => setPaymentDialogOpen(false)}
            sx={{
              borderRadius: "10px",
              py: { xs: 1.2, md: 1 },
              px: 3,
              fontWeight: 500,
              order: { xs: 2, md: 1 },
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handlePaymentConfirm}
            variant="contained"
            color="primary"
            disabled={
              (!paymentScreenshot && paymentMethod === "card") || loading
            }
            sx={{
              borderRadius: "10px",
              py: { xs: 1.2, md: 1 },
              px: 3,
              fontWeight: 600,
              order: { xs: 1, md: 2 },
              boxShadow: `0 6px 16px ${alpha(
                theme.palette.primary.main,
                0.25
              )}`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 10px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Подтвердить"}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(5px)",
          backgroundColor: alpha(theme.palette.common.black, 0.7),
        }}
        open={paymentComplete}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            color="primary"
            thickness={5}
            size={isMobile ? 48 : 60}
            sx={{
              boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.6)}`,
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              mt: 3,
              color: "white",
              fontWeight: 600,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            Заказ успешно оформлен! Перенаправление...
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
}

export default OrderPage;
