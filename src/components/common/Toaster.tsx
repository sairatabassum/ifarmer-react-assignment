"use client";

import React from "react";
import { Xmark } from "iconoir-react";
import cn from "@/utils/cn";

type ToasterProps = {
    message: string | null;
    type: "success" | "error" | "info" | "warning";
    onClose: () => void;
};

const typeStyles: Record<ToasterProps["type"], string> = {
    success: "bg-[rgb(255,232,205)] text-green-800 border-l-4 border-green-500",
    error: "bg-[rgb(255,220,220)] text-red-800 border-l-4 border-red-500",
    info: "bg-[rgb(255,242,235)] text-blue-800 border-l-4 border-blue-500",
    warning: "bg-[rgb(255,214,186)] text-yellow-800 border-l-4 border-yellow-500",
};

export const Toaster: React.FC<ToasterProps> = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg font-medium flex items-center justify-between z-50 transition-transform duration-300 ease-in-out min-w-[250px] max-w-[90%]",
                typeStyles[type]
            )}
        >
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 hover:opacity-80 transition-opacity"
            >
                <Xmark className="h-5 w-5" />
            </button>
        </div>
    );
};
