import React, { useState, useEffect } from "react";
import { Typography, Box, useTheme } from "@mui/material";

const AnimatedText = ({
  texts = [],
  variant = "h2",
  color,
  sx = {},
  typingSpeed = 150,
  eraseSpeed = 100,
  delayBetweenTexts = 3000,
  className,
}) => {
  const theme = useTheme();
  const [textIndex, setTextIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Эффект для мигающего курсора
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prevState) => !prevState);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Эффект для печатающегося текста
  useEffect(() => {
    if (texts.length === 0) return;

    const currentFullText = texts[textIndex];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Добавляем символы
          if (text.length < currentFullText.length) {
            setText(currentFullText.slice(0, text.length + 1));
          } else {
            // Ждем перед удалением
            setTimeout(() => {
              setIsDeleting(true);
            }, delayBetweenTexts);
          }
        } else {
          // Удаляем символы
          if (text.length > 0) {
            setText(currentFullText.slice(0, text.length - 1));
          } else {
            // Переходим к следующему тексту
            setIsDeleting(false);
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? eraseSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [
    text,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    eraseSpeed,
    delayBetweenTexts,
  ]);

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", ...sx }}>
      <Typography
        variant={variant}
        color={color}
        className={className}
        sx={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
          minHeight:
            variant === "h1" ? "3.5rem" : variant === "h2" ? "3rem" : "2.5rem",
        }}
      >
        {text}
      </Typography>
      <Typography
        variant={variant}
        color={color || "primary.main"}
        sx={{
          opacity: cursorVisible ? 1 : 0,
          ml: 0.5,
          animation: "blink 1s step-end infinite",
          display: "inline-block",
        }}
      >
        |
      </Typography>
    </Box>
  );
};

export default AnimatedText;
