"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "iconoir-react";
import cn from "../../utils/cn";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "/assignment-1/home", label: "Assignment 1" },
        { href: "/assignment-2", label: "Assignment 2" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-background to-card/80 backdrop-blur-lg shadow-sm border-b border-border font-sans transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 hover:text-primary"
                    >
                        iFarmer 👨‍🌾
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative text-sm font-semibold transition-all duration-300 hover:text-primary group",
                                    pathname.startsWith(item.href)
                                        ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                                <span
                                    className={cn(
                                        "absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full",
                                        pathname.startsWith(item.href) && "w-full"
                                    )}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X height={24} width={24} /> : <Menu height={24} width={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="space-y-2 rounded-xl bg-card/80 ring-1 ring-border shadow-md p-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block text-sm font-semibold transition-all duration-300 hover:text-primary",
                                    pathname.startsWith(item.href)
                                        ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
