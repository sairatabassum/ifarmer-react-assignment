"use client";

import cn from '../../utils/cn';
import { X } from 'iconoir-react';
import React from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0">
            <div className="relative w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg transition-transform duration-300 animate-in zoom-in-95 slide-in-from-top-1/2">
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    );
};

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add any specific props if needed
}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);

interface DialogTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add any specific props if needed
}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add any specific props if needed
}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add any specific props if needed
}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />
);

export { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle };

