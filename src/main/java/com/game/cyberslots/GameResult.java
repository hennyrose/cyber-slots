package com.game.cyberslots;

import lombok.Data;

@Data
public class GameResult {
    private Symbol[][] grid;
    private int winAmount;
    private int newBalance;
    private boolean winningGame;
}