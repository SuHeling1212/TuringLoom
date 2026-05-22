package com.follarce.machine;

import com.follarce.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TuringMachine {
    private final List<TuringMachineRule> rules;
    private final List<TapeState> tapes;
    private String currentState;
    private boolean halted;
    private int stepCount;

    public TuringMachine(List<TuringMachineRule> rules, List<TapeState> tapes) {
        this.rules = new ArrayList<>(rules);
        this.tapes = new ArrayList<>();
        for (TapeState tape : tapes) {
            TapeState copy = new TapeState();
            copy.setId(tape.getId());
            copy.setName(tape.getName());
            copy.setType(tape.getType());
            copy.setInitialContent(tape.getInitialContent() != null ? tape.getInitialContent() : "00000000000000000000");
            copy.setHeadPosition(tape.getHeadPosition());
            this.tapes.add(copy);
        }
        this.currentState = "q0";
        this.halted = false;
        this.stepCount = 0;
    }

    public List<TuringMachineRule> findMatchingRules() {
        List<TuringMachineRule> matching = new ArrayList<>();
        
        for (TuringMachineRule rule : rules) {
            boolean stateMatches = rule.getStateAny() || rule.getCurrentState().equals(currentState);
            if (!stateMatches) continue;
            
            if (rule.getTapeIndex() < 0 || rule.getTapeIndex() >= tapes.size()) continue;
            
            TapeState tape = tapes.get(rule.getTapeIndex());
            String currentSymbol = tape.getCurrentSymbol();
            
            boolean symbolMatches = rule.getReadAny() || rule.getReadSymbol().equals(currentSymbol);
            if (symbolMatches) {
                matching.add(rule);
            }
        }
        
        return matching;
    }

    public void checkDuplicateRules(List<TuringMachineRule> matching) throws DuplicateRuleException {
        Map<String, List<TuringMachineRule>> keyMap = new HashMap<>();
        
        for (TuringMachineRule rule : matching) {
            String stateKey = rule.getStateAny() ? "*" : rule.getCurrentState();
            String symbolKey = rule.getReadAny() ? "*" : rule.getReadSymbol();
            String key = stateKey + "|" + symbolKey + "|" + rule.getTapeIndex();
            
            keyMap.computeIfAbsent(key, k -> new ArrayList<>()).add(rule);
        }
        
        for (Map.Entry<String, List<TuringMachineRule>> entry : keyMap.entrySet()) {
            if (entry.getValue().size() > 1) {
                StringBuilder names = new StringBuilder();
                for (int i = 0; i < entry.getValue().size(); i++) {
                    if (i > 0) names.append(", ");
                    names.append("\"").append(entry.getValue().get(i).getName()).append("\"");
                }
                throw new DuplicateRuleException(
                    "Duplicate rules found: " + names + " (same state, symbol, tape)",
                    entry.getValue()
                );
            }
        }
    }

    public StepResult step() throws DuplicateRuleException {
        if (halted) {
            return new StepResult(false, "Machine is halted", null);
        }
        
        List<TuringMachineRule> matching = findMatchingRules();
        
        if (matching.isEmpty()) {
            halted = true;
            return new StepResult(false, "No matching rules found for state '" + currentState + "'", null);
        }
        
        checkDuplicateRules(matching);
        
        TuringMachineRule rule = matching.get(0);
        
        if (rule.getTapeIndex() >= tapes.size()) {
            halted = true;
            return new StepResult(false, "Invalid tape index: " + rule.getTapeIndex(), null);
        }
        
        TapeState tape = tapes.get(rule.getTapeIndex());
        
        tape.writeSymbol(rule.getWriteSymbol());
        tape.moveHead(rule.getMoveDirection());
        currentState = rule.getNewState();
        
        if (rule.isShouldHalt()) {
            halted = true;
        }
        
        stepCount++;
        
        return new StepResult(true, "Executed rule: " + rule.getName(), rule);
    }

    public RunResult run(int maxSteps) throws DuplicateRuleException {
        List<StepResult> steps = new ArrayList<>();
        int executedSteps = 0;
        
        while (!halted && executedSteps < maxSteps) {
            StepResult result = step();
            steps.add(result);
            if (!result.isSuccess()) {
                break;
            }
            executedSteps++;
        }
        
        return new RunResult(
            executedSteps,
            halted,
            currentState,
            tapes,
            steps,
            executedSteps >= maxSteps && !halted ? "Reached maximum step limit: " + maxSteps : null
        );
    }

    public String getCurrentState() {
        return currentState;
    }

    public boolean isHalted() {
        return halted;
    }

    public int getStepCount() {
        return stepCount;
    }

    public List<TapeState> getTapes() {
        return tapes;
    }

    public List<TuringMachineRule> getRules() {
        return rules;
    }

    public void setCurrentState(String state) {
        this.currentState = state;
    }

    public void reset() {
        this.currentState = "q0";
        this.halted = false;
        this.stepCount = 0;
        for (TapeState tape : tapes) {
            if (tape.getInitialContent() != null) {
                tape.setInitialContent(tape.getInitialContent());
            }
            tape.setHeadPosition(0);
        }
    }

    public static class StepResult {
        private final boolean success;
        private final String message;
        private final TuringMachineRule executedRule;

        public StepResult(boolean success, String message, TuringMachineRule executedRule) {
            this.success = success;
            this.message = message;
            this.executedRule = executedRule;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public TuringMachineRule getExecutedRule() {
            return executedRule;
        }
    }

    public static class RunResult {
        private final int totalSteps;
        private final boolean halted;
        private final String finalState;
        private final List<TapeState> finalTapes;
        private final List<StepResult> stepResults;
        private final String warning;

        public RunResult(int totalSteps, boolean halted, String finalState, 
                        List<TapeState> finalTapes, List<StepResult> stepResults, String warning) {
            this.totalSteps = totalSteps;
            this.halted = halted;
            this.finalState = finalState;
            this.finalTapes = finalTapes;
            this.stepResults = stepResults;
            this.warning = warning;
        }

        public int getTotalSteps() {
            return totalSteps;
        }

        public boolean isHalted() {
            return halted;
        }

        public String getFinalState() {
            return finalState;
        }

        public List<TapeState> getFinalTapes() {
            return finalTapes;
        }

        public List<StepResult> getStepResults() {
            return stepResults;
        }

        public String getWarning() {
            return warning;
        }

        public String getTapeContent(int tapeIndex) {
            if (tapeIndex >= 0 && tapeIndex < finalTapes.size()) {
                return finalTapes.get(tapeIndex).getTapeContent();
            }
            return null;
        }
    }

    public static class DuplicateRuleException extends Exception {
        private final List<TuringMachineRule> duplicateRules;

        public DuplicateRuleException(String message, List<TuringMachineRule> duplicateRules) {
            super(message);
            this.duplicateRules = duplicateRules;
        }

        public List<TuringMachineRule> getDuplicateRules() {
            return duplicateRules;
        }
    }
}
