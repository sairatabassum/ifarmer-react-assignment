'use client'

import { Home, Plus, ShoppingBag } from 'iconoir-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigationItems: NavItem[] = [
    { title: "All Products", url: "/assignment-2", icon: Home },
    { title: "Add Product", url: "/assignment-2/create", icon: Plus },
];

interface AppProps {
    children: React.ReactNode;
}


export default function SidebarLayout({ children }: AppProps) {
    const pathname = usePathname();

    const isActive = (path: string): boolean => pathname === path;

    return (
        <div className="flex h-screen bg-product-background-1 text-white font-sans">

            <aside className="w-64 bg-foreground border-r border-border flex flex-col p-4 shadow-lg">

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
                                                : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                                            }
                    `}
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

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
