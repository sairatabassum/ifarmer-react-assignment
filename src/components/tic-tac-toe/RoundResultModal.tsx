'use client';

import cn from '@/utils/cn';
import { useEffect, useState } from 'react';

interface RoundResultModalProps {
    winnerName: string | null; // null means draw
    onClose: () => void;
}

const RoundResultModal: React.FC<RoundResultModalProps> = ({ winnerName, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 2000); // show for 2s

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500',
                isVisible ? 'opacity-100' : 'opacity-0'
            )}
        >
            <div className="relative rounded-3xl px-12 py-10 text-center shadow-2xl border-4 border-primary/30 bg-card animate-pop">
                <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-lg">
                    {winnerName ? `${winnerName} Wins! 🏆` : "It's a Draw! 🤝"}
                </h2>
            </div>
        </div>
    );
};

export default RoundResultModal;
