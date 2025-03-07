package com.game.cyberslots;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.util.Random;

@Service
public class GameService {
    private final Random random = new Random();
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String BALANCE_KEY_PREFIX = "player:balance:";
    private static final String LOCK_KEY_PREFIX = "player:lock:";
    private static final int INITIAL_BALANCE = 8000;
    private static final Duration LOCK_DURATION = Duration.ofSeconds(5);

    public GameService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public GameResult spin(String sessionId, int bet) {
        String lockKey = LOCK_KEY_PREFIX + sessionId;
        boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "locked", LOCK_DURATION);

        if (!locked) {
            throw new IllegalStateException("Another game is in progress");
        }

        try {
            String balanceKey = BALANCE_KEY_PREFIX + sessionId;
            Integer balance = (Integer) redisTemplate.opsForValue().get(balanceKey);
            if (balance == null) {
                balance = INITIAL_BALANCE;
                redisTemplate.opsForValue().set(balanceKey, balance);
            }

            if (balance < bet) {
                throw new IllegalStateException("Insufficient balance");
            }

            Symbol[][] grid = generateGrid();
            boolean isWin = checkWin(grid);
            int winAmount = isWin ? calculateWin(grid, bet) : 0;

            int newBalance = balance - bet + winAmount;
            redisTemplate.opsForValue().set(balanceKey, newBalance);

            GameResult result = new GameResult();
            result.setGrid(grid);
            result.setWinAmount(winAmount);
            result.setNewBalance(newBalance);
            result.setWinningGame(isWin);

            return result;
        } finally {
            redisTemplate.delete(lockKey);
        }
    }

    @Transactional
    public int initializeBalance(String sessionId) {
        String balanceKey = BALANCE_KEY_PREFIX + sessionId;
        redisTemplate.opsForValue().set(balanceKey, INITIAL_BALANCE);
        return INITIAL_BALANCE;
    }

    @Transactional
    public int getBalance(String sessionId) {
        String balanceKey = BALANCE_KEY_PREFIX + sessionId;
        Integer balance = (Integer) redisTemplate.opsForValue().get(balanceKey);
        return balance != null ? balance : INITIAL_BALANCE;
    }

    @Transactional
    public GameResult buyBonus(String sessionId, BonusSpinRequest request) {
        String lockKey = LOCK_KEY_PREFIX + sessionId;
        boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "locked", LOCK_DURATION);

        if (!locked) {
            throw new IllegalStateException("Another game is in progress");
        }

        try {
            String balanceKey = BALANCE_KEY_PREFIX + sessionId;
            Integer balance = (Integer) redisTemplate.opsForValue().get(balanceKey);
            if (balance == null) {
                balance = INITIAL_BALANCE;
                redisTemplate.opsForValue().set(balanceKey, balance);
            }

            int bonusPrice = calculateBonusPrice(request.getBet(), request.getBonusType());

            if (balance < bonusPrice) {
                throw new IllegalStateException("Insufficient balance for bonus");
            }

            Symbol[][] grid = generateBonusGrid(request.getBonusType());
            boolean isWin = checkWin(grid);
            int winAmount = calculateBonusWin(grid, request.getBet(), request.getBonusType());

            int newBalance = balance - bonusPrice + winAmount;
            redisTemplate.opsForValue().set(balanceKey, newBalance);

            GameResult result = new GameResult();
            result.setGrid(grid);
            result.setWinAmount(winAmount);
            result.setNewBalance(newBalance);
            result.setWinningGame(isWin);

            return result;
        } finally {
            redisTemplate.delete(lockKey);
        }
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

    private Symbol[][] generateBonusGrid(String bonusType) {
        if ("neon-rush".equals(bonusType)) {
            return generateNeonRushGrid();
        }
        return generateGrid(); // Default grid for other bonus types
    }

    private Symbol[][] generateNeonRushGrid() {
        Symbol[][] grid = new Symbol[4][3];
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 3; j++) {
                // Increased probability for CYBER_PUNK and CHIP
                int rand = random.nextInt(100);
                if (rand < 30) { // 30% chance for CYBER_PUNK
                    grid[i][j] = Symbol.CYBER_PUNK;
                } else if (rand < 55) { // 25% chance for CHIP
                    grid[i][j] = Symbol.CHIP;
                } else { // 45% chance for other symbols
                    Symbol[] otherSymbols = {Symbol.NEON, Symbol.MATRIX, Symbol.LASER, Symbol.HOLOGRAM};
                    grid[i][j] = otherSymbols[random.nextInt(otherSymbols.length)];
                }
            }
        }
        return grid;
    }

    private boolean checkWin(Symbol[][] grid) {
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

    private int calculateBonusPrice(int bet, String bonusType) {
        return switch (bonusType) {
            case "neon-rush" -> bet * 50;
            case "cyberstorm" -> bet * 100;
            default -> throw new IllegalArgumentException("Invalid bonus type");
        };
    }

    private int calculateBonusWin(Symbol[][] grid, int bet, String bonusType) {
        if ("neon-rush".equals(bonusType)) {
            int totalWin = 0;
            // Run 5 free spins
            for (int spin = 0; spin < 5; spin++) {
                Symbol[][] spinGrid = generateNeonRushGrid();
                if (checkWin(spinGrid)) {
                    totalWin += calculateWin(spinGrid, bet);
                }
            }
            return totalWin;
        }
        return calculateWin(grid, bet);
    }
}