import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const Logo = () => (
    <Typography
      variant="h6"
      component={RouterLink}
      to="/"
      sx={{
        color: theme.palette.primary.main,
        textDecoration: "none",
        fontWeight: 800,
        fontSize: { xs: "1.5rem", md: "1.8rem" },
        letterSpacing: "-0.5px",
        display: "flex",
        alignItems: "center",
        "& span": {
          color: theme.palette.text.primary,
          fontWeight: 300,
        },
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -2,
          left: 0,
          width: "30%",
          height: "3px",
          background: "linear-gradient(90deg, #E85A4F 0%, transparent 100%)",
          borderRadius: "2px",
        },
        "&:hover": {
          "&::after": {
            width: "50%",
            transition: "width 0.3s ease",
          },
        },
      }}
      className="logo-text"
    >
      Ellin<span>Princess</span>
    </Typography>
  );

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(15px)",
        backgroundColor: scrolled
          ? alpha(theme.palette.background.paper, 0.9)
          : alpha(theme.palette.background.paper, 0.7),
        transition: "all 0.3s ease",
        borderBottom: scrolled
          ? `1px solid ${alpha(theme.palette.divider, 0.3)}`
          : "none",
        boxShadow: scrolled
          ? `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`
          : "none",
        zIndex: 1100,
      }}
      className={scrolled ? "glass-effect" : ""}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: "center",
            py: { xs: 1, md: 1.5 },
          }}
        >
          <Logo />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
