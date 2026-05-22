package com.follarce.server.dto;

import com.follarce.server.model.TapeState;
import com.follarce.server.model.TuringMachineRule;

import java.util.List;

public class MachineResponse {
    private boolean success;
    private String message;
    private int totalSteps;
    private boolean halted;
    private String finalState;
    private List<TapeState> tapes;
    private TuringMachineRule executedRule;
    private List<String> duplicateRules;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getTotalSteps() { return totalSteps; }
    public void setTotalSteps(int totalSteps) { this.totalSteps = totalSteps; }

    public boolean isHalted() { return halted; }
    public void setHalted(boolean halted) { this.halted = halted; }

    public String getFinalState() { return finalState; }
    public void setFinalState(String finalState) { this.finalState = finalState; }

    public List<TapeState> getTapes() { return tapes; }
    public void setTapes(List<TapeState> tapes) { this.tapes = tapes; }

    public TuringMachineRule getExecutedRule() { return executedRule; }
    public void setExecutedRule(TuringMachineRule executedRule) { this.executedRule = executedRule; }

    public List<String> getDuplicateRules() { return duplicateRules; }
    public void setDuplicateRules(List<String> duplicateRules) { this.duplicateRules = duplicateRules; }
}
