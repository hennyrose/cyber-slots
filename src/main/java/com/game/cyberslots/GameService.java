package com.game.cyberslots;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    private final Random random = new Random();
    private final ConcurrentHashMap<String, Integer> playerBalance = new ConcurrentHashMap<>();

    public GameResult spin(String sessionId, int bet) {
        playerBalance.putIfAbsent(sessionId, 8000);
        int balance = playerBalance.get(sessionId);

        if (balance < bet) {
            throw new IllegalStateException("Insufficient balance");
        }

        Symbol[][] grid = generateGrid();
        boolean isWin = checkWin(grid);
        int winAmount = isWin ? calculateWin(grid, bet) : 0;

        int newBalance = balance - bet + winAmount;
        playerBalance.put(sessionId, newBalance);

        GameResult result = new GameResult();
        result.setGrid(grid);
        result.setWinAmount(winAmount);
        result.setNewBalance(newBalance);
        result.setWinningGame(isWin);

        return result;
    }

    private Symbol[][] generateGrid() {
        Symbol[][] grid = new Symbol[4][3];
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                grid[i][j] = Symbol.values()[random.nextInt(Symbol.values().length)];
            }
        }
        return grid;
    }

    private boolean checkWin(Symbol[][] grid) {
        // Перевірка горизонтальних ліній
        for (int i = 0; i < 4; i++) {
            if (grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
                return true;
            }
        }
        return false;
    }

    private int calculateWin(Symbol[][] grid, int bet) {
        for (int i = 0; i < 4; i++) {
            if (grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]) {
                return bet * grid[i][0].getMultiplier();
            }
        }
        return 0;
    }

    public GameResult buyBonus(String sessionId, BonusSpinRequest request) {
        int balance = playerBalance.get(sessionId);
        int bonusPrice = calculateBonusPrice(request.getBet(), request.getBonusType());

        if (balance < bonusPrice) {
            throw new IllegalStateException("Insufficient balance for bonus");
        }

        Symbol[][] grid = generateBonusGrid(request.getBonusType());
        boolean isWin = checkWin(grid);
        int winAmount = calculateBonusWin(grid, request.getBet(), request.getBonusType());

        int newBalance = balance - bonusPrice + winAmount;
        playerBalance.put(sessionId, newBalance);

        GameResult result = new GameResult();
        result.setGrid(grid);
        result.setWinAmount(winAmount);
        result.setNewBalance(newBalance);
        result.setWinningGame(isWin);

        return result;
    }

    private int calculateBonusPrice(int bet, String bonusType) {
        return switch (bonusType) {
            case "neon-rush" -> bet * 50;
            case "cyberstorm" -> bet * 100;
            default -> throw new IllegalArgumentException("Invalid bonus type");
        };
    }

    private Symbol[][] generateBonusGrid(String bonusType) {
        // Реалізуйте логіку генерації символів з підвищеними шансами
        // відповідно до типу бонусу
        return generateGrid(); // Тимчасово використовуємо звичайну генерацію
    }

    private int calculateBonusWin(Symbol[][] grid, int bet, String bonusType) {
        // Реалізуйте розрахунок виграшу з урахуванням бонусних правил
        return calculateWin(grid, bet);
    }
}