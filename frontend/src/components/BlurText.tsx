import React, { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const animateElement = (index: number) => {
      setTimeout(() => {
        setAnimatedElements(prev => new Set([...prev, index]));
        
        if (index === elements.length - 1 && onAnimationComplete) {
          setTimeout(onAnimationComplete, 300); // Wait for animation to complete
        }
      }, index * delay);
    };

    elements.forEach((_, index) => {
      animateElement(index);
    });
  }, [inView, delay, elements.length, onAnimationComplete]);

  const getInitialStyle = () => {
    const baseStyle = {
      filter: 'blur(10px)',
      opacity: 0,
      transform: direction === 'top' ? 'translateY(-20px)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
    return baseStyle;
  };

  const getAnimatedStyle = () => {
    return {
      filter: 'blur(0px)',
      opacity: 1,
      transform: 'translateY(0px)',
      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => (
        <span
          key={index}
          className="inline-block will-change-[transform,filter,opacity]"
          style={animatedElements.has(index) ? getAnimatedStyle() : getInitialStyle()}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  );
};

export default BlurText;
