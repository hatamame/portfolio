import { FC } from 'react';
import GlitchText from './GlitchText';
import BootingText from './BootingText';

interface HiddenContentProps {
    backToPortfolio: () => void;
}

const HiddenContent: FC<HiddenContentProps> = ({ backToPortfolio }) => {
    const contentText = `Congratulations, Explorer. You have demonstrated exceptional skill and persistence.
This portfolio is merely the gateway.
My true work involves crafting the digital universes of tomorrow.
The boundaries of reality are blurring, and I am one of the architects.
If you wish to collaborate on projects that redefine what's possible, you know how to reach me.`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-400 font-mono p-6 text-center animate-fadeIn">
            <div className="max-w-3xl w-full border-2 border-cyan-500/50 p-8 rounded-lg shadow-xl shadow-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
                <GlitchText className="text-4xl md:text-5xl font-bold mb-8 text-white">
                    :: SECRET SECTOR ::
                </GlitchText>

                <div className="text-left min-h-[220px]">
                    <BootingText
                        text={contentText}
                        startCondition={true}
                        className="text-lg"
                    />
                </div>

                <p className="mt-8 text-sm text-gray-500">
                    - Access Key: 34.0522° N, 118.2437° W -
                </p>
            </div>
            <button
                onClick={backToPortfolio}
                className="mt-12 px-8 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
                [ RETURN TO PORTFOLIO ]
            </button>
        </div>
    );
};

export default HiddenContent;