package com.game.cyberslots;

import lombok.Data;

@Data
public class BonusSpinRequest {
    private int bet;
    private String bonusType; // "neon-rush" або "cyberstorm"
}