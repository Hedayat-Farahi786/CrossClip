import "./DarkMode.css";
import { useTheme } from "./ThemeProvider";
export const DarkMode = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <div className="toggle-switch">
      {isDarkMode}
      <label className="switch-label">
        <input
          onChange={toggleDarkMode}
          checked={isDarkMode}
          type="checkbox"
          className="checkbox hidden"
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};
