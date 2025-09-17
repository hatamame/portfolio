import { FC } from 'react';

interface SecretButtonProps {
    onClick: () => void;
}

const SecretButton: FC<SecretButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-50 animate-secret-button-appear group"
            aria-label="Access hidden content"
        >
            <div className="relative animate-secret-button-float">
                <svg
                    className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse group-hover:bg-white" />
                </div>
            </div>
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ACCESS
            </span>
        </button>
    );
};

export default SecretButton;