package com.game.cyberslots;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", allowedHeaders = "*")
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


    @GetMapping("/balance")
    public int getBalance(HttpSession session) {
        return 8000; // Початковий баланс
    }
}