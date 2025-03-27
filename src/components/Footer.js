import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  useTheme,
  alpha,
} from "@mui/material";

function Footer() {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 2, md: 2.5 },
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(10px)",
        borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "center" },
            textAlign: { xs: "center", sm: "left" },
            gap: { xs: 1, sm: 0 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", md: "0.8rem" },
              order: { xs: 2, sm: 1 },
              mb: { xs: 0.5, sm: 0 },
              opacity: 0.8,
              transition: "opacity 0.3s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
            className="footer-copyright"
          >
            © {currentYear} EllinPrincess. Все права защищены.
          </Typography>

          <Link
            href="#"
            color="text.secondary"
            sx={{
              textDecoration: "none",
              fontSize: { xs: "0.75rem", md: "0.8rem" },
              order: { xs: 1, sm: 2 },
              mb: { xs: 0.5, sm: 0 },
              opacity: 0.8,
              transition: "all 0.3s ease",
              "&:hover": {
                color: theme.palette.primary.main,
                opacity: 1,
              },
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -2,
                left: 0,
                width: 0,
                height: "1px",
                backgroundColor: theme.palette.primary.main,
                transition: "width 0.3s ease",
              },
              "&:hover::after": {
                width: "100%",
              },
            }}
            className="footer-link"
          >
            Политика конфиденциальности
          </Link>
        </Box>
      </Container>

      {/* Декоративный элемент */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-30px",
          right: "5%",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: alpha(theme.palette.primary.main, 0.05),
          filter: "blur(30px)",
        }}
      />
    </Box>
  );
}

export default Footer;
