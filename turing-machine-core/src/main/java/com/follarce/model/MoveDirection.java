package com.follarce.model;

public enum MoveDirection {
    LEFT("left"),
    RIGHT("right"),
    STAY("stay");

    private final String value;

    MoveDirection(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static MoveDirection fromString(String value) {
        for (MoveDirection dir : MoveDirection.values()) {
            if (dir.value.equalsIgnoreCase(value)) {
                return dir;
            }
        }
        throw new IllegalArgumentException("Unknown move direction: " + value);
    }
}
