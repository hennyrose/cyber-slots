// ReelColumn.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Symbol from './Symbol.jsx';

// Випадкове вибір емодзі з вашого набору (або можна додати своє)
const ALL_EMOJIS = [
    '🤖', '💡', '💾', '🌐', '⚡', '👾', '🎰', '🔮', '🦾', '🚀', '🛸', '🔌',
    '🚨', '🤘', '💻', '🕹️', '🧬', '🤯', '👁️', '🪐'
];

const ColumnWrapper = styled.div`
  overflow: hidden;
  height: 320px; /* Залежить від загальної кількості символів */
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
`;

const Reel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ReelColumn = ({ finalSymbols, isSpinning, winningLine, colIndex }) => {
    // Кількість «фейкових» рандомних символів, які показуємо перед тим,
    // як «доїде» до фінальних 4-х
    const randomSymbolsCount = 8;

    // Висота одного символа (запас + відступ)
    const symbolHeight = 78;

    // Загальна кількість, яку покаже Reel (8 фейкових + 4 фінальних)
    const totalSymbols = randomSymbolsCount + finalSymbols.length;

    // Початково згенеруємо випадкові емодзі
    const [randomSymbols, setRandomSymbols] = useState([]);
    useEffect(() => {
        createRandomSymbols();
    }, []);

    // Генерація нового списку випадкових емодзі
    const createRandomSymbols = () => {
        const arr = [];
        for (let i = 0; i < randomSymbolsCount; i++) {
            const rnd = Math.floor(Math.random() * ALL_EMOJIS.length);
            arr.push(ALL_EMOJIS[rnd]);
        }
        setRandomSymbols(arr);
    };

    // Масив "показуваних" символів: спочатку рандомні, потім — фінальні
    const displayedSymbols = useMemo(() => {
        return [...randomSymbols, ...finalSymbols.map(s => s)];
    }, [randomSymbols, finalSymbols]);

    /**
     * На момент старту спіну ми генеруємо нові випадкові символи,
     * щоб кожен раз прокрутка була «унікальна».
     */
    useEffect(() => {
        if (isSpinning) {
            createRandomSymbols();
        }
    }, [isSpinning]);

    /**
     * Визначаємо анімацію.
     * - "rest": початковий стан (y: 0)
     * - "spin": прокрутка вгору (мінус повна висота на totalSymbols),
     *   і після закінчення — автоматично повертається у "rest",
     *   але тоді ми фактично оновимо state (finalSymbols), тож візуально показуватиме результат.
     */
    const reelVariants = {
        rest: {
            y: 0
        },
        spin: {
            y: -(symbolHeight * randomSymbolsCount), // «прокручуємо» тільки до моменту появи фінальних 4 символів
            transition: {
                duration: 1.5, // тривалість прокрутки
                ease: 'easeInOut'
            }
        }
    };

    return (
        <ColumnWrapper>
            <Reel
                initial="rest"
                animate={isSpinning ? 'spin' : 'rest'}
                variants={reelVariants}
            >
                {displayedSymbols.map((icon, index) => {
                    // Знаходимо, чи цей символ співпадає з winningLine (треба звірити індекс)
                    // Але потрібно пам’ятати, що перші randomSymbolsCount — фейкові,
                    // а реальні 4 йдуть в кінці. Той, хто виграв, знаходиться в останніх 4,
                    // тож відповідний рядок = index - randomSymbolsCount.
                    const realSymbolIndex = index - randomSymbolsCount;
                    const isWinning =
                        realSymbolIndex >= 0 &&
                        realSymbolIndex === winningLine;

                    // Якщо icon – це «символ Java» (object), дістанемо .icon,
                    // інакше припускаємо, що це просто рядок
                    const displayedIcon = typeof icon === 'object' ? icon.icon : icon;

                    return (
                        <Symbol
                            key={`symbol-${colIndex}-${index}`}
                            icon={displayedIcon}
                            isWinning={isWinning}
                        />
                    );
                })}
            </Reel>
        </ColumnWrapper>
    );
};

export default ReelColumn;