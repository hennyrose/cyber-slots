// SlotMachine.jsx
import styled from '@emotion/styled';
import Symbol from './Symbol.jsx';

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

    @media (max-width: 768px) {
        width: 95vw;
        padding: 10px;
        gap: 4px;
    }
`;



const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
`;

const SlotMachine = ({ grid, winningLine, isSpinning }) => (
    <Grid>
        {[0, 1, 2].map((colIndex) => (
            <Column key={colIndex}>
                {[0, 1, 2, 3].map((rowIndex) => (
                    <Symbol
                        key={`${rowIndex}-${colIndex}`}
                        icon={grid[rowIndex][colIndex]}
                        isWinning={winningLine === rowIndex}
                        isSpinning={isSpinning}
                        delay={colIndex * 0.2}
                    />
                ))}
            </Column>
        ))}
    </Grid>
);

export default SlotMachine;