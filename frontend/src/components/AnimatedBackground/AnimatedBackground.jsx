/**
 * AnimatedBackground.jsx
 * 
 * Academic E-Learning Background Component
 * Features knowledge network visualization with floating nodes and connection lines
 * 
 * Design Philosophy:
 * - Represents knowledge transfer and academic progression
 * - Professional, university-appropriate aesthetics
 * - Subtle, non-distracting animations
 * 
 * @example
 * import AnimatedBackground from './components/AnimatedBackground';
 * 
 * function App() {
 *   return (
 *     <>
 *       <AnimatedBackground />
 *       {// Your content}
 *     </>
 *   );
 * }
 */

import { memo, useState, useEffect, useCallback } from 'react';
import './AnimatedBackground.css';

/**
 * AnimatedBackground Component
 * 
 * Renders a full-viewport animated background with academic theme.
 * The component has z-index: -1, so it stays behind all content.
 */
const AnimatedBackground = memo(function AnimatedBackground({
    performanceMode = false,
    showNetwork = true,
    showNodes = true,
    showConnections = true,
    className = '',
}) {
    const containerClasses = [
        'animated-background',
        performanceMode ? 'animated-background--performance' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={containerClasses}
            role="presentation"
            aria-hidden="true"
        >
            {/* Knowledge Network Grid */}
            {showNetwork && !performanceMode && (
                <div className="animated-background__network" />
            )}

            {/* Floating Knowledge Nodes */}
            {showNodes && !performanceMode && (
                <div className="animated-background__nodes">
                    <div className="knowledge-node knowledge-node--1" />
                    <div className="knowledge-node knowledge-node--2" />
                    <div className="knowledge-node knowledge-node--3" />
                    <div className="knowledge-node knowledge-node--4" />
                    <div className="knowledge-node knowledge-node--5" />
                    <div className="knowledge-node knowledge-node--6" />
                </div>
            )}

            {/* Connection Lines (Knowledge Flow) */}
            {showConnections && !performanceMode && (
                <div className="animated-background__connections">
                    <div className="connection-line connection-line--1" />
                    <div className="connection-line connection-line--2" />
                    <div className="connection-line connection-line--3" />
                    <div className="connection-line connection-line--4" />
                </div>
            )}
        </div>
    );
});

export default AnimatedBackground;

/* ==========================================
   Theme Toggle Hook
   ========================================== */

/**
 * useTheme Hook - Manages dark/light mode
 * 
 * @example
 * const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return 'dark'; // Default to dark for academic look
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark-mode');
        } else {
            root.removeAttribute('data-theme');
            root.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, setTheme, toggleTheme };
}
