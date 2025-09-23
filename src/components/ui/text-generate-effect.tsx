"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.35),
      }
    );
  }, [scope.current]);
  
  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-[#D3CEAD] opacity-0"
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };
  
  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-[#D3CEAD] text-3xl leading-snug tracking-wide bg-gradient-to-r from-[#D3CEAD] to-[#C3BE9D] bg-clip-text text-transparent">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};