import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [headerHeight, setHeaderHeight] = useState(70); // Примерная высота хедера по умолчанию

  // Находим реальную высоту хедера при загрузке страницы
  useEffect(() => {
    const header =
      document.querySelector("header") ||
      document.querySelector(".MuiAppBar-root");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  // Get order details from location state
  const orderData = location.state || {};

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        mt: `${headerHeight + 16}px`, // Добавляем отступ сверху для хедера + небольшой дополнительный отступ
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          mb: 4,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: theme.palette.success.main,
            mb: 2,
          }}
        />

        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Заказ успешно оформлен!
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "600px", mb: 4 }}
        >
          Ваш заказ был успешно оформлен и отправлен на обработку. В ближайшее
          время с вами свяжутся для подтверждения.
        </Typography>
      </Box>

      {Object.keys(orderData).length > 0 && (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            p: 3,
            mb: 4,
            background: alpha(theme.palette.success.main, 0.05),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Информация о заказе
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {orderData.serviceName && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Услуга
                </Typography>
                <Typography variant="body1" gutterBottom fontWeight={500}>
                  {orderData.serviceName}
                </Typography>
              </Grid>
            )}

            {orderData.date && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Дата
                </Typography>
                <Typography variant="body1" gutterBottom fontWeight={500}>
                  {orderData.date}
                </Typography>
              </Grid>
            )}

            {orderData.time && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Время
                </Typography>
                <Typography variant="body1" gutterBottom fontWeight={500}>
                  {orderData.time}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{ py: 1.5, px: 4, fontWeight: 600 }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
}

export default SuccessPage;
