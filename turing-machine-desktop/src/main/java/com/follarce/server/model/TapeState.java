package com.follarce.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TapeState {
    private String id;
    private String type;
    private List<String> cells;
    private int headPosition;
    private String name;
    private String initialContent;

    public TapeState() {
        this.cells = new ArrayList<>();
        this.headPosition = 0;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getCells() { return cells; }
    public void setCells(List<String> cells) { this.cells = cells; }

    public int getHeadPosition() { return headPosition; }
    public void setHeadPosition(int headPosition) { this.headPosition = headPosition; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInitialContent() { return initialContent; }
    public void setInitialContent(String initialContent) {
        this.initialContent = initialContent;
    }

    public String getCurrentSymbol() {
        if (headPosition >= 0 && headPosition < cells.size()) {
            return cells.get(headPosition);
        }
        return "0";
    }

    public void writeSymbol(String symbol) {
        while (headPosition < 0) {
            cells.add(0, "0");
            headPosition++;
        }
        while (headPosition >= cells.size()) {
            cells.add("0");
        }
        cells.set(headPosition, symbol);
    }

    public void moveHead(MoveDirection direction) {
        switch (direction) {
            case LEFT:
                headPosition--;
                if (headPosition < 0) {
                    cells.add(0, "0");
                    headPosition = 0;
                }
                break;
            case RIGHT:
                headPosition++;
                if (headPosition >= cells.size()) {
                    cells.add("0");
                }
                break;
            case STAY:
                break;
        }
    }

    public String getTapeContent() {
        return String.join("", cells);
    }
}
