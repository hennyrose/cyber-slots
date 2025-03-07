package com.game.cyberslots;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "https://cyber-slots.onrender.com",
        allowCredentials = "true",
        allowedHeaders = "*")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/spin")
    public GameResult spin(@RequestBody SpinRequest request, HttpSession session) {
        return gameService.spin(session.getId(), request.getBet());
    }

    @PostMapping("/bonus-spin")
    public GameResult bonusSpin(@RequestBody BonusSpinRequest request, HttpSession session) {
        return gameService.buyBonus(session.getId(), request);
    }

    @PostMapping("/restart")
    public int restartDemo(HttpServletRequest request) {
        // Invalidate current session
        HttpSession currentSession = request.getSession(false);
        if (currentSession != null) {
            currentSession.invalidate();
        }

        // Create new session
        HttpSession newSession = request.getSession(true);
        return gameService.initializeBalance(newSession.getId());
    }


    @GetMapping("/balance")
    public int getBalance(HttpSession session) {
        return gameService.getBalance(session.getId());
    }
}