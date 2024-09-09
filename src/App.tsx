import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { Home } from "./components/Home";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Export the i18n instance from a separate file
import Video from "./components/Video";

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app bg-slate-200 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Home />} />
            <Route path="/services" element={<Home />} />
            <Route path="/pricing" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/video/:id" element={<Video />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
