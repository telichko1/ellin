import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import OrderPage from "./pages/OrderPage";
import SuccessPage from "./pages/SuccessPage";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/global.css";

function App() {
  // Эффект для дополнительного контроля прокрутки
  useEffect(() => {
    // Функция для предотвращения горизонтальной прокрутки
    const preventHorizontalScroll = (e) => {
      // Проверяем, что прокрутка не внутри элемента с горизонтальной прокруткой
      if (
        !e.target.closest(".desktop-scroll-container") &&
        !e.target.closest(".mobile-scroll-container")
      ) {
        // Останавливаем горизонтальную прокрутку страницы
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
        }
      }
    };

    // Устанавливаем overflow: hidden для body, чтобы избежать двойной прокрутки
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";

    // Добавляем обработчик события прокрутки колесом
    window.addEventListener("wheel", preventHorizontalScroll, {
      passive: false,
    });

    // Убираем обработчик при размонтировании
    return () => {
      window.removeEventListener("wheel", preventHorizontalScroll);
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div
          className="app"
          style={{
            overflow: "auto",
            position: "fixed",
            width: "100%",
            maxWidth: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            background: "transparent",
          }}
        >
          <Header />
          <main
            className="main-content"
            style={{
              overflow: "auto",
              maxWidth: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "transparent",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/service/:id" element={<ServicePage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
