import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="text-center">
            <h1 className="shimmer-text text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent pb-2">
                {title}
            </h1>
            <p className="mt-2 text-lg md:text-xl text-gray-600">
                {subtitle}
            </p>
        </header>
    );
};

export default Header;