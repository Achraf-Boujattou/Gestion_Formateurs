/**
 * ThemeToggle.jsx
 * 
 * A floating button to toggle between light and dark mode.
 * Uses the useTheme hook from AnimatedBackground.
 */

import { useTheme } from '../AnimatedBackground';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
        >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
    );
};

export default ThemeToggle;
