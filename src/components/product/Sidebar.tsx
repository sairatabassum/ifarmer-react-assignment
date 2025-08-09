'use client'

import { Home, Plus, ShoppingBag, Menu } from 'iconoir-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigationItems: NavItem[] = [
    { title: "All Products", url: "/assignment-2/products", icon: Home },
    { title: "Add Product", url: "/assignment-2/create", icon: Plus },
];

interface AppProps {
    children: React.ReactNode;
}

export default function SidebarLayout({ children }: AppProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string): boolean => pathname === path;

    return (
        <div className="flex h-screen bg-product-background-1 text-white font-sans">

            <button
                className="md:hidden fixed top-[70px] left-4 z-50 p-2 bg-product-brown rounded-md shadow-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                <Menu className="h-6 w-6 text-white" />
            </button>

            <aside
                className={`
                    fixed top-[45px] left-0 h-full w-50 bg-[#FFF5F0] flex flex-col p-4 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:flex
                    z-40
                `}
            >
                <div className="border-b border-neutral-700 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-product-brown rounded-xl shadow-md">
                            <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-product-text">Products</h2>
                            <p className="text-sm text-neutral-400">Management</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="mb-6">
                        <ul className="space-y-1">
                            {navigationItems.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.url}
                                        className={`
                      flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                      ${isActive(item.url)
                                                ? 'bg-product-brown text-product-text shadow-inner'
                                                : 'text-product-text hover:bg-neutral-700 hover:text-white'
                                            }
                    `}
                                        onClick={() => setSidebarOpen(false)} 
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
