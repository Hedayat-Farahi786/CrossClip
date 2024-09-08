import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "de"],
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: { useSuspense: false },
  });

const languages = [
  {
    code: "en",
    name: "English",
    flag: (
      <svg
        className="w-5 h-5 rounded-full me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 3900 3900"
      >
        <path fill="#b22234" d="M0 0h7410v3900H0z" />
        <path
          d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
          stroke="#fff"
          stroke-width="300"
        />
        <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
        <g fill="#fff">
          <g id="d">
            <g id="c">
              <g id="e">
                <g id="b">
                  <path
                    id="a"
                    d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                  />
                  <use xlink:href="#a" y="420" />
                  <use xlink:href="#a" y="840" />
                  <use xlink:href="#a" y="1260" />
                </g>
                <use xlink:href="#a" y="1680" />
              </g>
              <use xlink:href="#b" x="247" y="210" />
            </g>
            <use xlink:href="#c" x="494" />
          </g>
          <use xlink:href="#d" x="988" />
          <use xlink:href="#c" x="1976" />
          <use xlink:href="#e" x="2470" />
        </g>
      </svg>
    ),
  },
  {
    code: "de",
    name: "Deutsch",
    flag: (
      <svg
        className="h-5 w-5 rounded-full me-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        id="flag-icon-css-de"
        viewBox="0 0 512 512"
      >
        <path fill="#ffce00" d="M0 341.3h512V512H0z" />
        <path d="M0 0h512v170.7H0z" />
        <path fill="#d00" d="M0 170.7h512v170.6H0z" />
      </svg>
    ),
  },
  // Add more languages as needed
];

export const LanguageSelection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedLanguageCode = localStorage.getItem("i18nextLng");
    if (storedLanguageCode) {
      i18n.changeLanguage(storedLanguageCode);
    }
  }, [i18n]);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <span className="w-5 h-5 rounded-full me-3">
          {currentLanguage.flag}
        </span>
        {t(currentLanguage.name)}
      </button>
      {isOpen && (
        <div className="z-50 absolute top-full right-0 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
          <ul className="py-2 font-medium" role="none">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                >
                  <div className="inline-flex items-center">
                    <span className="w-5 h-5 rounded-full me-2">
                      {lang.flag}
                    </span>
                    {t(lang.name)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
