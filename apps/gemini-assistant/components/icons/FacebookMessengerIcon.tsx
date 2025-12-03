import React from 'react';

export const FacebookMessengerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <defs>
            <linearGradient id="messenger-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00c6ff' }} />
                <stop offset="100%" style={{ stopColor: '#0072ff' }} />
            </linearGradient>
        </defs>
        <path fill="url(#messenger-gradient)" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.117 1.229-.276 1.229-.922V18.17c0-.98.816-1.782 1.8-1.782h1.53c4.636 0 8.427-3.418 8.427-7.585C21.193 4.312 17.017 0 12 0z"/>
        <path fill="#FFFFFF" d="M6.985 11.082l2.373 2.373 4.19-4.19-2.373-2.373z"/>
    </svg>
);