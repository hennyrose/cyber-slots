import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
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
    width: 120vw;
    max-width: 1200px;
    margin: 0 auto;
`;

/**
 * ReelColumn — контейнер колонки з анімацією прокручування.
 * У height можна поставити стільки пікселів, щоб вмістити всі символи
 * (наприклад, 4 символи по ~70-80px висоти кожен = 280-320px).
 */
const ReelColumn = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    overflow: hidden;
    height: 320px; 
`;

/**
 * reelVariants – два стани:
 *  - initial: немає зсуву (колонка в початковій позиції)
 *  - spin: зсуваємо колонку вгору, імітуючи прокрутку
 */
const reelVariants = {
    initial: { y: 0 },
    spin: {
        y: -320, // наскільки «прокручуємо» (залежить від height)
        transition: {
            duration: 1,
            ease: 'easeInOut',
        },
    },
};

const SlotMachine = ({ grid, winningLine, isSpinning }) => {
    const [columns, setColumns] = useState(grid);

    useEffect(() => {
        if (isSpinning) {
            // При початку спіну (за бажання можна додати «фейкові» рядки для більшої реалізму)
            // Тут просто залишимо, як є
        } else {
            // Після завершення спіну повертаємо «офіційний» grid
            setColumns(grid);
        }
    }, [isSpinning, grid]);

    return (
        <Grid>
            {[0, 1, 2].map((colIndex) => {
                const colItems = columns.map((row) => row[colIndex]);
                return (
                    <ReelColumn
                        key={`col-${colIndex}`}
                        initial="initial"
                        animate={isSpinning ? 'spin' : 'initial'}
                        variants={reelVariants}
                        onAnimationComplete={() => {
                            // Щоб точно повернутись до нового grid після прокрутки
                            setColumns(grid);
                        }}
                    >
                        {colItems.map((icon, rowIndex) => (
                            <Symbol
                                key={`${rowIndex}-${colIndex}`}
                                icon={icon}
                                // «isWinning» позначаємо, якщо дорівнює виграшному ряду
                                isWinning={winningLine === rowIndex}
                            />
                        ))}
                    </ReelColumn>
                );
            })}
        </Grid>
    );
};

export default SlotMachine;
