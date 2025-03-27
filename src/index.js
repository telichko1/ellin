import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Функция для исправления ширины экрана и предотвращения полосы прокрутки
const fixViewportWidth = () => {
  // Устанавливаем стили для предотвращения переполнения
  document.documentElement.style.overflowX = "hidden";
  document.documentElement.style.width = "100%";
  document.documentElement.style.position = "relative";
  document.body.style.overflowX = "hidden";
  document.body.style.width = "100%";
  document.body.style.position = "relative";
};

// Вызываем функцию исправления при загрузке
fixViewportWidth();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div
      className="animated-background"
      style={{
        overflow: "hidden",
        position: "fixed", // Меняем absolute на fixed для лучшей фиксации
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: -1, // Убеждаемся, что фон находится под всем содержимым
        pointerEvents: "none", // Предотвращаем перехват событий мыши фоном
      }}
    >
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
    </div>
    <App />
  </React.StrictMode>
);
