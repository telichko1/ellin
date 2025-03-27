import { useState, useEffect } from "react";

/**
 * Хук для отслеживания позиции скролла страницы
 * @returns {number} Текущая позиция скролла в пикселях
 */
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Функция для обновления позиции скролла
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Добавляем слушатель события скролла
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Вызываем обработчик сразу для установки начального значения
    handleScroll();

    // Очищаем слушатель события при размонтировании компонента
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
