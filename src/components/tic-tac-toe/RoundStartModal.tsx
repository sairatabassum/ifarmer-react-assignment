'use client';

import { useState, useEffect } from 'react';
import cn from '@/utils/cn';

interface RoundStartModalProps {
    round: number;
    onClose?: () => void; // optional callback
}

const RoundStartModal: React.FC<RoundStartModalProps> = ({ round, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.(); // call after hiding
        }, 1500);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500',
                isVisible ? 'opacity-100' : 'opacity-0'
            )}
        >
            <div
                className={cn(
                    'relative rounded-3xl px-12 py-10 text-center shadow-2xl border-4 border-primary/30 bg-card transition-transform duration-500',
                    isVisible ? 'scale-100 opacity-100 animate-in-zoom' : 'scale-90 opacity-0'
                )}
            >
                {round > 1 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-background text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                        New Round!
                    </div>
                )}

                <h2 className="text-6xl sm:text-7xl font-black tracking-tight bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-lg animate-pop">
                    ROUND {round}
                </h2>

                <p className="mt-4 text-2xl sm:text-3xl text-muted-foreground font-medium animate-fade-in">
                    Get Ready to Play 🎯
                </p>
            </div>
        </div>
    );
};

export default RoundStartModal;
