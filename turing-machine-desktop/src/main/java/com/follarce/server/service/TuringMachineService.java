package com.follarce.server.service;

import com.follarce.server.dto.MachineRequest;
import com.follarce.server.dto.MachineResponse;
import com.follarce.server.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TuringMachineService {

    public MachineResponse step(MachineRequest request) {
        MachineResponse response = new MachineResponse();
        
        List<TuringMachineRule> rules = request.getRules();
        List<TapeState> tapes = request.getTapes();
        String currentState = request.getCurrentState() != null ? request.getCurrentState() : "q0";
        
        List<TuringMachineRule> matching = findMatchingRules(rules, tapes, currentState);
        
        if (matching.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("No matching rules found for state '" + currentState + "'");
            response.setHalted(true);
            response.setFinalState(currentState);
            response.setTapes(tapes);
            return response;
        }
        
        List<String> duplicates = checkDuplicateRules(matching);
        if (!duplicates.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Duplicate rules found: " + String.join(", ", duplicates));
            response.setDuplicateRules(duplicates);
            response.setHalted(true);
            response.setFinalState(currentState);
            response.setTapes(tapes);
            return response;
        }
        
        TuringMachineRule rule = matching.get(0);
        
        if (rule.getTapeIndex() >= tapes.size()) {
            response.setSuccess(false);
            response.setMessage("Invalid tape index: " + rule.getTapeIndex());
            response.setHalted(true);
            response.setFinalState(currentState);
            response.setTapes(tapes);
            return response;
        }
        
        TapeState tape = tapes.get(rule.getTapeIndex());
        tape.writeSymbol(rule.getWriteSymbol());
        tape.moveHead(rule.getMoveDirection());
        
        response.setSuccess(true);
        response.setMessage("Executed rule: " + rule.getName());
        response.setExecutedRule(rule);
        response.setFinalState(rule.getNewState());
        response.setHalted(rule.isShouldHalt());
        response.setTapes(tapes);
        
        return response;
    }

    public MachineResponse run(MachineRequest request) {
        MachineResponse response = new MachineResponse();
        
        List<TuringMachineRule> rules = request.getRules();
        List<TapeState> tapes = deepCopyTapes(request.getTapes());
        String currentState = request.getCurrentState() != null ? request.getCurrentState() : "q0";
        int maxSteps = request.getMaxSteps() > 0 ? request.getMaxSteps() : 10000;
        
        int stepCount = 0;
        boolean halted = false;
        
        while (!halted && stepCount < maxSteps) {
            List<TuringMachineRule> matching = findMatchingRules(rules, tapes, currentState);
            
            if (matching.isEmpty()) {
                response.setMessage("No matching rules found for state '" + currentState + "'");
                halted = true;
                break;
            }
            
            List<String> duplicates = checkDuplicateRules(matching);
            if (!duplicates.isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Duplicate rules found: " + String.join(", ", duplicates));
                response.setDuplicateRules(duplicates);
                response.setTotalSteps(stepCount);
                response.setFinalState(currentState);
                response.setTapes(tapes);
                return response;
            }
            
            TuringMachineRule rule = matching.get(0);
            
            if (rule.getTapeIndex() >= tapes.size()) {
                response.setMessage("Invalid tape index: " + rule.getTapeIndex());
                halted = true;
                break;
            }
            
            TapeState tape = tapes.get(rule.getTapeIndex());
            tape.writeSymbol(rule.getWriteSymbol());
            tape.moveHead(rule.getMoveDirection());
            currentState = rule.getNewState();
            
            if (rule.isShouldHalt()) {
                halted = true;
            }
            
            stepCount++;
        }
        
        response.setSuccess(true);
        response.setTotalSteps(stepCount);
        response.setHalted(halted);
        response.setFinalState(currentState);
        response.setTapes(tapes);
        
        if (stepCount >= maxSteps && !halted) {
            response.setMessage("Reached maximum step limit: " + maxSteps);
        } else {
            response.setMessage("Simulation completed");
        }
        
        return response;
    }

    private List<TuringMachineRule> findMatchingRules(List<TuringMachineRule> rules, List<TapeState> tapes, String currentState) {
        List<TuringMachineRule> matching = new ArrayList<>();
        
        for (TuringMachineRule rule : rules) {
            boolean stateMatches = rule.isStateAny() || rule.getCurrentState().equals(currentState);
            if (!stateMatches) continue;
            
            if (rule.getTapeIndex() < 0 || rule.getTapeIndex() >= tapes.size()) continue;
            
            TapeState tape = tapes.get(rule.getTapeIndex());
            String currentSymbol = tape.getCurrentSymbol();
            
            boolean symbolMatches = rule.isReadAny() || rule.getReadSymbol().equals(currentSymbol);
            if (symbolMatches) {
                matching.add(rule);
            }
        }
        
        return matching;
    }

    private List<String> checkDuplicateRules(List<TuringMachineRule> matching) {
        Map<String, List<TuringMachineRule>> keyMap = new HashMap<>();
        
        for (TuringMachineRule rule : matching) {
            String stateKey = rule.isStateAny() ? "*" : rule.getCurrentState();
            String symbolKey = rule.isReadAny() ? "*" : rule.getReadSymbol();
            String key = stateKey + "|" + symbolKey + "|" + rule.getTapeIndex();
            
            keyMap.computeIfAbsent(key, k -> new ArrayList<>()).add(rule);
        }
        
        for (List<TuringMachineRule> rules : keyMap.values()) {
            if (rules.size() > 1) {
                List<String> names = new ArrayList<>();
                for (TuringMachineRule r : rules) {
                    names.add("\"" + r.getName() + "\"");
                }
                return names;
            }
        }
        
        return Collections.emptyList();
    }

    private List<TapeState> deepCopyTapes(List<TapeState> original) {
        List<TapeState> copy = new ArrayList<>();
        for (TapeState tape : original) {
            TapeState newTape = new TapeState();
            newTape.setId(tape.getId());
            newTape.setName(tape.getName());
            newTape.setType(tape.getType());
            newTape.setHeadPosition(tape.getHeadPosition());
            newTape.setCells(new ArrayList<>(tape.getCells()));
            newTape.setInitialContent(tape.getInitialContent());
            copy.add(newTape);
        }
        return copy;
    }
}
