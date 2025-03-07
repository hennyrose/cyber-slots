import styled from '@emotion/styled';
import Symbol from './Symbol.jsx';
import { motion } from 'framer-motion';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 20px;
    background: rgba(26, 26, 36, 0.9);
    border-radius: 20px;
    border: 3px solid ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px rgba(0, 255, 159, 0.3);
    width: 90vw;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;

    @media (max-width: 768px) {
        width: 95vw;
        padding: 10px;
        gap: 4px;
    }
`;

const WinningRow = styled(motion.div)`
    position: absolute;
    left: 0;
    right: 0;
    height: 40px; // Reduced from 86px
    background: rgba(0, 255, 159, 0.2);
    border-radius: 10px;
    z-index: 1;
    pointer-events: none;

    @media (max-width: 768px) {
        height: 28px; // Reduced from 58px
    }
`;


const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    position: relative;
    z-index: 2;
`;

const SlotMachine = ({ grid, winningLine, isSpinning }) => {
    const getWinningRowStyle = () => {
        if (winningLine === null) return {};
        const baseOffset = 20; // padding top
        const symbolHeight = window.innerWidth <= 768 ? 58 : 86; // height + gap
        return {
            top: `${baseOffset + (symbolHeight * winningLine)}px`
        };
    };

    return (
        <Grid>
            {winningLine !== null && (
                <WinningRow
                    style={getWinningRowStyle()}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        boxShadow: ['0 0 10px rgba(0, 255, 159, 0.5)', '0 0 20px rgba(0, 255, 159, 0.8)', '0 0 10px rgba(0, 255, 159, 0.5)']
                    }}
                    transition={{
                        boxShadow: {
                            repeat: Infinity,
                            duration: 1.5
                        }
                    }}
                />
            )}
            {[0, 1, 2].map((colIndex) => (
                <Column key={colIndex}>
                    {[0, 1, 2, 3].map((rowIndex) => (
                        <Symbol
                            key={`${rowIndex}-${colIndex}`}
                            icon={grid[rowIndex][colIndex]}
                            isSpinning={isSpinning}
                            delay={colIndex * 0.2}
                        />
                    ))}
                </Column>
            ))}
        </Grid>
    );
};

export default SlotMachine;
