import React from 'react';
import SidebarLayout from '../../components/product/Sidebar';

export default function Assignment2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarLayout>
            {children}
        </SidebarLayout>
    );
}
