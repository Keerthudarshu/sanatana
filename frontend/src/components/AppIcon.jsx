
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

// Custom Jar SVG Icon
const JarIcon = ({ size = 24, color = 'currentColor', className = '', strokeWidth = 2, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 24"
        stroke={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    >
        <rect x="6" y="7" width="12" height="13" rx="3" stroke={color} strokeWidth={strokeWidth} />
        <rect x="8" y="3" width="8" height="4" rx="2" stroke={color} strokeWidth={strokeWidth} />
        <path d="M9 7V5m6 2V5" stroke={color} strokeWidth={strokeWidth} />
    </svg>
);

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    // Support custom icons
    if (name === 'Jar') {
        return <JarIcon size={size} color={color} className={className} strokeWidth={strokeWidth} {...props} />;
    }

    const IconComponent = LucideIcons?.[name];
    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }
    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;