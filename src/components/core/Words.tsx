"use client"
import { motion, useInView } from 'framer-motion';
import localFont from 'next/font/local';
import * as React from 'react';

const latino = localFont({
  src: '../../../public/fonts/Degular/Regular.otf',
})
 
export function WordsPullUp({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const splittedText = text.split(' ');
 
  const pullupVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className="flex justify-center overflow-y-hidden">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? 'animate' : ''}
          custom={i}
          className={
            `pr-2 md:px-3 ${className} overflow-y-hidden`
          }
        >
          {current == '' ? <span> </span> : current}
        </motion.div>
      ))}
    </div>
  );
}