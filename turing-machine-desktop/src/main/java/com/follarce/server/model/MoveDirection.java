package com.follarce.server.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MoveDirection {
    LEFT, RIGHT, STAY;

    @JsonCreator
    public static MoveDirection fromString(String value) {
        if (value == null) return RIGHT;
        return switch (value.toLowerCase()) {
            case "left" -> LEFT;
            case "right" -> RIGHT;
            case "stay" -> STAY;
            default -> throw new IllegalArgumentException("Unknown move direction: " + value);
        };
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }
}
