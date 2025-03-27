import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#E85A4F",
      light: "#FF8A80",
      dark: "#C41C00",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5D5C61",
      light: "#8E8D93",
      dark: "#303033",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F9F9F9",
    },
    text: {
      primary: "#2B2B2B",
      secondary: "#5D5C61",
    },
    error: {
      main: "#F44336",
    },
    success: {
      main: "#4CAF50",
    },
    info: {
      main: "#2196F3",
    },
    warning: {
      main: "#FF9800",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "2.7rem",
      lineHeight: 1.2,
      margin: "1rem 0",
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.2rem",
      lineHeight: 1.3,
      margin: "0.8rem 0",
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.7rem",
      lineHeight: 1.4,
      margin: "0.6rem 0",
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      margin: "0.5rem 0",
      letterSpacing: "0.00735em",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.1rem",
      lineHeight: 1.5,
      margin: "0.4rem 0",
      letterSpacing: "0em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.6,
      margin: "0.3rem 0",
      letterSpacing: "0.0075em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      letterSpacing: "0.01071em",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02857em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 8px rgba(0, 0, 0, 0.06)",
    "0px 4px 12px rgba(0, 0, 0, 0.06)",
    "0px 8px 16px rgba(0, 0, 0, 0.06)",
    "0px 12px 24px rgba(0, 0, 0, 0.08)",
    "0px 16px 32px rgba(0, 0, 0, 0.08)",
    ...Array(19).fill("none"),
  ],
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: "smooth",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "0.6rem 1.6rem",
          fontWeight: 600,
          boxShadow: "0px 6px 16px rgba(232, 90, 79, 0.25)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 10px 20px rgba(232, 90, 79, 0.4)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            boxShadow: "0px 3px 8px rgba(232, 90, 79, 0.3)",
            transform: "translateY(1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #E85A4F 30%, #FF8A80 90%)",
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
        sizeMedium: {
          ["@media (max-width:600px)"]: {
            padding: "0.5rem 1.2rem",
            fontSize: "0.9rem",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0px 12px 36px rgba(0, 0, 0, 0.12)",
          },
          ["@media (max-width:600px)"]: {
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.06)",
          ["@media (max-width:600px)"]: {
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.06)",
          },
        },
        outlined: {
          borderColor: "rgba(0, 0, 0, 0.09)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          ["@media (max-width:600px)"]: {
            height: "32px",
            fontSize: "0.75rem",
          },
        },
        outlined: {
          borderWidth: "1.5px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "box-shadow 0.3s ease",
            "&.Mui-focused": {
              boxShadow: "0px 4px 12px rgba(232, 90, 79, 0.15)",
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            fontWeight: 600,
          },
          "&.Mui-completed": {
            fontWeight: 600,
          },
          ["@media (max-width:600px)"]: {
            fontSize: "0.85rem",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          ["@media (max-width:600px)"]: {
            padding: "0 16px",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: "break-word",
        },
      },
    },
  },
});

// Применяем адаптивные шрифты
theme = responsiveFontSizes(theme);

export default theme;
