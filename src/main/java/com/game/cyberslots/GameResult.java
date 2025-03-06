package com.game.cyberslots;

import lombok.Data;

@Data
public class GameResult {
    private Symbol[][] grid;
    private int winAmount;      // сума виграшу
    private int newBalance;     // новий баланс
    private boolean winningGame; // індикатор виграшу
}