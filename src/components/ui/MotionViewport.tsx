"use client";

import { motion, UseInViewOptions } from "framer-motion";
import { ReactNode } from "react";

interface MotionViewportProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scale?: number;
  staggerChildren?: number;
  once?: boolean;
}

export function MotionViewport({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 40,
  scale = 1,
  staggerChildren = 0,
  once = true,
}: MotionViewportProps) {
  const getInitial = () => {
    const initial: any = { opacity: 0, scale };
    if (direction === "up") initial.y = distance;
    if (direction === "down") initial.y = -distance;
    if (direction === "left") initial.x = distance;
    if (direction === "right") initial.x = -distance;
    return initial;
  };

  const getAnimate = () => {
    return {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as any,
        staggerChildren,
      },
    };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
