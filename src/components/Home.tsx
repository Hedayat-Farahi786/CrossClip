import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useTypingEffect = (text, typingSpeed = 150, pauseDuration = 5000) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer;
    
    const typeText = () => {
      setIsTyping(true);
      let i = 0;
      timer = setInterval(() => {
        if (i <= text.length) {
          setDisplayedText(text.slice(0, i));
          i++;
        } else {
          clearInterval(timer);
          setTimeout(eraseText, pauseDuration);
        }
      }, typingSpeed);
    };

    const eraseText = () => {
      setIsTyping(false);
      let i = text.length;
      timer = setInterval(() => {
        if (i >= 0) {
          setDisplayedText(text.slice(0, i));
          i--;
        } else {
          clearInterval(timer);
          setTimeout(typeText, typingSpeed);
        }
      }, typingSpeed / 2);
    };

    typeText();

    return () => {
      clearInterval(timer);
    };
  }, [text, typingSpeed, pauseDuration]);

  return { displayedText, isTyping };
};

export const Home = () => {
  const { t } = useTranslation();
  const { displayedText, isTyping } = useTypingEffect(t('hello'), 150, 5000);

  return (
    <div className="home flex items-center justify-center w-full h-[80vh]">
      <p className="text-5xl font-semibold">
        {displayedText}
        {isTyping && <span className="animate-blink">|</span>}
      </p>
    </div>
  );
};

export default Home;