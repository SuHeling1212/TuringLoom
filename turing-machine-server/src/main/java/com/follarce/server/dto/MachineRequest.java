package com.follarce.server.dto;

import com.follarce.server.model.TapeState;
import com.follarce.server.model.TuringMachineRule;

import java.util.List;

public class MachineRequest {
    private List<TuringMachineRule> rules;
    private List<TapeState> tapes;
    private String currentState;
    private int maxSteps;

    public List<TuringMachineRule> getRules() { return rules; }
    public void setRules(List<TuringMachineRule> rules) { this.rules = rules; }

    public List<TapeState> getTapes() { return tapes; }
    public void setTapes(List<TapeState> tapes) { this.tapes = tapes; }

    public String getCurrentState() { return currentState; }
    public void setCurrentState(String currentState) { this.currentState = currentState; }

    public int getMaxSteps() { return maxSteps; }
    public void setMaxSteps(int maxSteps) { this.maxSteps = maxSteps; }
}
