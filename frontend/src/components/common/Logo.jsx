import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const Logo = ({ theme = 'dark', collapsed = false, className, isMobile = false }) => {
    const navigate = useNavigate();

    // Theme Configuration
    const isLight = theme === 'light'; // Light theme = Dark background (e.g., Landing Page)

    // Styles
    const containerBase = "flex items-center space-x-3 cursor-pointer select-none group";

    // Icon Container Styles
    const iconContainerBase = "relative flex items-center justify-center rounded-xl transition-all duration-300 overflow-hidden";
    const iconContainerSize = isMobile ? "w-8 h-8 rounded-lg" : "w-10 h-10";

    const iconContainerTheme = isLight
        ? "bg-white/10 border border-white/20 group-hover:bg-white/20"
        : "bg-blue-600 shadow-md group-hover:bg-blue-700";

    // Text Styles
    const textBase = "font-bold tracking-tight transition-colors duration-300";
    const textSize = isMobile ? "text-lg" : "text-xl";
    const textTheme = isLight
        ? "text-white bg-linear-to-r from-white to-gray-300 bg-clip-text"
        : "text-gray-900 group-hover:text-blue-600";

    // Icon Styles
    const iconBase = "transition-transform duration-300 group-hover:scale-110";
    const iconSize = isMobile ? "w-4 h-4" : "w-5 h-5";
    const iconColor = "text-white";

    return (
        <div
            className={clsx(containerBase, collapsed ? 'justify-center' : '', className)}
            onClick={() => {
                // Determine destination based on auth state logic or usage context
                // For now, simpler to just let parent handle click or default to home/dashboard based on URL?
                // Actually, sidebar usually doesn't navigate on logo click, but landing page does.
                // Let's keep it simple: if it's strictly a visual component, maybe remove navigation?
                // But usually logos go home.
                // Landing page Nav uses window.scrollTo. Sidebar doesn't have an action.
                // I will leave the click handler to the parent or add an optional onClick prop.
            }}
        >
            <motion.div
                className={clsx(iconContainerBase, iconContainerSize, iconContainerTheme)}
                whileHover={{ rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                {/* Shine effect for Dark mode (Blue button) */}
                {!isLight && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <Mic className={clsx(iconBase, iconSize, iconColor)} />
            </motion.div>

            {!collapsed && (
                <div className="min-w-0">
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={clsx(textBase, textSize, textTheme)}
                    >
                        VIRQA
                    </motion.span>
                </div>
            )}
        </div>
    );
};

export default Logo;
