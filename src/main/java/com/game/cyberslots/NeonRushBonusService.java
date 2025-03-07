package com.game.cyberslots;

import org.springframework.stereotype.Service;

@Service
public class NeonRushBonusService {

    private static final double INCREASED_CHANCE_MULTIPLIER = 2.0;

    public NeonRushBonusResult generateNeonRushBonus() {
        NeonRushBonusResult result = new NeonRushBonusResult();
        Symbol[][][] allSpinGrids = new Symbol[5][4][3]; // 5 spins, 4x3 grid
        int totalWin = 0;

        // Generate 5 spins with increased CYBER_PUNK and CHIP probability
        for (int spin = 0; spin < 5; spin++) {
            Symbol[][] grid = new Symbol[4][3];
            for (int row = 0; row < 4; row++) {
                for (int col = 0; col < 3; col++) {
                    double rand = Math.random();
                    if (rand < 0.3 * INCREASED_CHANCE_MULTIPLIER) {
                        grid[row][col] = Symbol.CYBER_PUNK;
                    } else if (rand < 0.5 * INCREASED_CHANCE_MULTIPLIER) {
                        grid[row][col] = Symbol.CHIP;
                    } else {
                        // Distribute remaining probability among other symbols
                        Symbol[] otherSymbols = {Symbol.NEON, Symbol.MATRIX, Symbol.LASER, Symbol.HOLOGRAM};
                        grid[row][col] = otherSymbols[(int)(Math.random() * otherSymbols.length)];
                    }
                }
            }
            allSpinGrids[spin] = grid;

            // Calculate win for this spin
            // Add your win calculation logic here
            totalWin += calculateWin(grid);
        }

        result.setFreeSpinGrids(allSpinGrids);
        result.setTotalWinAmount(totalWin);

        return result;
    }

    private int calculateWin(Symbol[][] grid) {
        // Implement your winning logic here
        return 0; // Placeholder
    }
}