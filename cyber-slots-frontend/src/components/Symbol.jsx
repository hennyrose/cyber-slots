// SlotMachine.jsx
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ReelColumn from './ReelColumn.jsx';

// Стилі «машини» (тобто контейнера для трьох колонок)
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 20px;
    background: rgba(26, 26, 36, 0.9);
    border-radius: 20px;
    border: 3px solid ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px rgba(0, 255, 159, 0.3);
    width: 120vw;
    max-width: 1200px;
    margin: 0 auto;
`;

const SlotMachine = ({ grid, winningLine, isSpinning }) => {
    const [finalGrid, setFinalGrid] = useState(grid);

    // Якщо змінилося «isSpinning» з true -> false,
    // оновимо state, щоб компоненти ReelColumn показали «фінальні» символи
    useEffect(() => {
        if (!isSpinning) {
            setFinalGrid(grid);
        }
    }, [isSpinning, grid]);

    return (
        <Grid>
            {/**
             * Кожна з трьох ReelColumn відображає один стовпець (colIndex),
             * передаємо туди масив із 4 фінальних символів + ознаку виграшної лінії
             */}
            {[0, 1, 2].map((colIndex) => (
                <ReelColumn
                    key={`col-${colIndex}`}
                    finalSymbols={finalGrid.map(row => row[colIndex])}
                    isSpinning={isSpinning}
                    winningLine={winningLine}
                    colIndex={colIndex}
                />
            ))}
        </Grid>
    );
};

export default SlotMachine;