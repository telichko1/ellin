import React, { useCallback } from "react";
import { useTheme, alpha } from "@mui/material";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = ({ variant = "default" }) => {
  const theme = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const getConfig = () => {
    // Базовая конфигурация
    const baseConfig = {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            lineLinked: {
              opacity: 0.5,
            },
          },
        },
      },
      particles: {
        links: {
          color: alpha(theme.palette.primary.main, 0.4),
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 40,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    };

    // Варианты конфигураций для разных эффектов
    const variants = {
      default: {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          color: {
            value: [
              theme.palette.primary.main,
              theme.palette.primary.light,
              theme.palette.secondary.main,
            ],
          },
        },
      },
      bubbles: {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 25,
          },
          opacity: {
            value: 0.4,
          },
          links: {
            enable: false,
          },
          size: {
            value: { min: 4, max: 18 },
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false,
            },
          },
          move: {
            speed: 0.8,
            direction: "top",
            straight: false,
            random: true,
          },
          color: {
            value: [
              alpha(theme.palette.primary.main, 0.6),
              alpha(theme.palette.primary.light, 0.4),
              alpha(theme.palette.secondary.main, 0.5),
            ],
          },
        },
      },
      snow: {
        ...baseConfig,
        particles: {
          ...baseConfig.particles,
          number: {
            value: 50,
            density: {
              enable: true,
              area: 800,
            },
          },
          opacity: {
            value: 0.7,
          },
          links: {
            enable: false,
          },
          size: {
            value: { min: 1, max: 4 },
            random: true,
          },
          move: {
            speed: 1.5,
            direction: "bottom",
            straight: false,
            random: true,
            outMode: "out",
          },
          color: {
            value: "#ffffff",
          },
        },
        background: {
          opacity: 0,
        },
      },
    };

    return variants[variant] || variants.default;
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={getConfig()}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticlesBackground;
