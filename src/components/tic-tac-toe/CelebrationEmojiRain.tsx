'use client';

const CelebrationEmojiRain = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
                <span
                    key={i}
                    className="absolute text-4xl animate-emoji-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        top: '-2rem',
                    }}
                >
                    🎉
                </span>
            ))}
        </div>
    );
};

export default CelebrationEmojiRain;
