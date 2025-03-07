package com.game.cyberslots;

import lombok.Data;

@Data
public class NeonRushBonusResult {
    private Symbol[][] initialGrid;
    private Symbol[][][] freeSpinGrids; // Array of 5 grids for free spins
    private int totalWinAmount;
    private int newBalance;
}