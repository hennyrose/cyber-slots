import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Symbol from './Symbol.jsx';

// Збільшена висота для «фейкових» символів + основні символи
const REEL_HEIGHT = 480; // 6 рядів по ~80px, можна підібрати під ваші розміри

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
 * Зробили вищим, щоб вмістити більше символів (фейкові + справжні).
 */
const ReelColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  overflow: hidden;
  height: ${REEL_HEIGHT}px; 
`;

/**
 * reelVariants — анімація імітації реалістичного оберту:
 *  1. "spin": довший прохід з повторенням (щоб «крутилось» кілька разів),
 *  2. "final": плавне «приземлення» на фінальні символи.
 */
const reelVariants = {
    initial: { y: 0 },
    spin: {
        y: -REEL_HEIGHT,
        transition: {
            duration: 1.5,
            ease: 'easeInOut',
            repeat: 1,           // скільки разів скролити «туди-сюди»
            repeatType: 'loop',  // цикл (loop)
        },
    },
    final: {
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const SlotMachine = ({ grid, winningLine, isSpinning }) => {
    // columns містить фейкові + реальні символи.
    // Коли spin завершується, підмінюємо на фінальний grid.
    const [columns, setColumns] = useState([]);

    // Генеруємо трохи випадкових емодзі для фейку (залежно від вашої логіки).
    // Тут можна підставити будь-що, аби створити ефект «зайвих» рядків.
    const getFakeSymbols = () => {
        // Для прикладу, 2 фейкові рядки зверху і 1 знизу.
        // Можна змінити кількість під ваш дизайн.
        const fakeTop = [
            ['👽', '💲', '💣'],
            ['🚀', '🍀', '🪐'],
        ];
        const fakeBottom = [
            ['💵', '🌟', '🔥'],
        ];
        // Ваш основний grid ставимо між ними.
        return [...fakeTop, ...grid, ...fakeBottom];
    };

    useEffect(() => {
        if (isSpinning) {
            // На початку спіну встановлюємо фейкові + реальні символи
            setColumns(getFakeSymbols());
        } else {
            // Коли спін завершується - оновлюємо стовпці офіційним grid
            setColumns(grid);
        }
    }, [isSpinning, grid]);

    return (
        <Grid>
            {[0, 1, 2].map((colIndex) => {
                // Формуємо список іконок для конкретної колонки, враховуючи фейкові рядки
                const colItems = columns.map((row) => row[colIndex]);
                return (
                    <ReelColumn
                        key={`col-${colIndex}`}
                        initial="initial"
                        animate={isSpinning ? 'spin' : 'final'}
                        variants={reelVariants}
                        onAnimationComplete={(def) => {
                            // Коли завершується анімація «spin» — переходимо до «final»
                            // або повертаємо справжний grid, якщо це остання фаза.
                            if (def === 'spin') {
                                // Підмінюємо контент на справжні символи й «приземляємось»
                                setColumns(grid);
                            }
                        }}
                    >
                        {colItems.map((icon, rowIndex) => (
                            <Symbol
                                key={`${rowIndex}-${colIndex}`}
                                icon={icon}
                                // «isWinning» позначаємо, якщо дорівнює виграшному ряду в фінальному результаті
                                isWinning={!isSpinning && winningLine === rowIndex}
                            />
                        ))}
                    </ReelColumn>
                );
            })}
        </Grid>
    );
};

export default SlotMachine;
