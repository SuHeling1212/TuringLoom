package com.follarce.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TuringMachineRule {
    private String id;
    private String name;
    private int tapeIndex;
    private String currentState;
    private String readSymbol;
    private Boolean readAny;
    private Boolean stateAny;
    private String writeSymbol;
    private MoveDirection moveDirection;
    private String newState;
    private boolean shouldHalt;
    private String nextRuleId;

    public TuringMachineRule() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTapeIndex() {
        return tapeIndex;
    }

    public void setTapeIndex(int tapeIndex) {
        this.tapeIndex = tapeIndex;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }

    public String getReadSymbol() {
        return readSymbol;
    }

    public void setReadSymbol(String readSymbol) {
        this.readSymbol = readSymbol;
    }

    public Boolean getReadAny() {
        return readAny != null && readAny;
    }

    public void setReadAny(Boolean readAny) {
        this.readAny = readAny;
    }

    public Boolean getStateAny() {
        return stateAny != null && stateAny;
    }

    public void setStateAny(Boolean stateAny) {
        this.stateAny = stateAny;
    }

    public String getWriteSymbol() {
        return writeSymbol;
    }

    public void setWriteSymbol(String writeSymbol) {
        this.writeSymbol = writeSymbol;
    }

    public MoveDirection getMoveDirection() {
        return moveDirection;
    }

    public void setMoveDirection(MoveDirection moveDirection) {
        this.moveDirection = moveDirection;
    }

    @JsonProperty("moveDirection")
    public void setMoveDirectionFromString(String moveDirection) {
        this.moveDirection = MoveDirection.fromString(moveDirection);
    }

    public String getNewState() {
        return newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
    }

    public boolean isShouldHalt() {
        return shouldHalt;
    }

    public void setShouldHalt(boolean shouldHalt) {
        this.shouldHalt = shouldHalt;
    }

    public String getNextRuleId() {
        return nextRuleId;
    }

    public void setNextRuleId(String nextRuleId) {
        this.nextRuleId = nextRuleId;
    }

    @Override
    public String toString() {
        return String.format("Rule[%s: %s, read '%s'%s, state '%s'%s -> write '%s', %s, state '%s'%s]",
                name,
                "tape " + tapeIndex,
                readAny ? "(any)" : readSymbol,
                readAny ? " (any)" : "",
                stateAny ? "(any)" : currentState,
                stateAny ? " (any)" : "",
                writeSymbol,
                moveDirection,
                newState,
                shouldHalt ? " HALT" : "");
    }
}
