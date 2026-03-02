import React from 'react';

export interface HeaderProps {
    title?: string;
    logoUrl?: string;
    navigationItems?: Array<{ label: string; href: string }>;
}

const HeaderBlock: React.FC<HeaderProps> = ({
    title = 'Demo Store',
    navigationItems = [],
}) => {
    return (
        <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
            <div className="text-xl font-bold">{title}</div>
            <nav className="hidden md:flex space-x-4">
                {navigationItems.map((item, i) => (
                    <a
                        key={i}
                        href={item.href}
                        className="text-gray-600 hover:text-black"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
        </header>
    );
};

export default HeaderBlock;
