package com.game.cyberslots;

public enum Symbol {
    CYBER_PUNK("🤖", 5),
    NEON("💡", 3),
    CHIP("💾", 4),
    MATRIX("🌐", 2),
    LASER("⚡", 3),
    HOLOGRAM("👾", 2);

    private final String icon;
    private final int multiplier;

    Symbol(String icon, int multiplier) {
        this.icon = icon;
        this.multiplier = multiplier;
    }

    public String getIcon() {
        return icon;
    }

    public int getMultiplier() {
        return multiplier;
    }
}