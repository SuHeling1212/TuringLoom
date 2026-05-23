package com.follarce.test;

import com.follarce.server.dto.MachineRequest;
import com.follarce.server.dto.MachineResponse;
import com.follarce.server.model.*;
import com.follarce.server.service.TuringMachineService;

import java.util.*;

public class TuringMachineTest {
    public static void main(String[] args) {
        System.out.println("=== Turing Machine Terminal Test ===\n");
        
        TuringMachineService service = new TuringMachineService();
        
        TapeState tape = new TapeState();
        tape.setId("tape-1");
        tape.setName("Test Tape");
        tape.setType("1d");
        tape.setHeadPosition(0);
        tape.setCells(new ArrayList<>(Arrays.asList("0", "0", "0", "0", "0", "0", "0", "0", "0", "0")));
        tape.setInitialContent("0000000000");
        
        TuringMachineRule rule1 = new TuringMachineRule();
        rule1.setId("rule-1");
        rule1.setName("Convert 0 to 1");
        rule1.setTapeIndex(0);
        rule1.setCurrentState("q0");
        rule1.setReadSymbol("0");
        rule1.setWriteSymbol("1");
        rule1.setMoveDirection(MoveDirection.RIGHT);
        rule1.setNewState("q0");
        rule1.setShouldHalt(false);
        
        TuringMachineRule rule2 = new TuringMachineRule();
        rule2.setId("rule-2");
        rule2.setName("Halt on blank");
        rule2.setTapeIndex(0);
        rule2.setCurrentState("q0");
        rule2.setReadSymbol(" ");
        rule2.setWriteSymbol(" ");
        rule2.setMoveDirection(MoveDirection.STAY);
        rule2.setNewState("qhalt");
        rule2.setShouldHalt(true);
        
        MachineRequest request = new MachineRequest();
        request.setRules(Arrays.asList(rule1, rule2));
        request.setTapes(Arrays.asList(tape));
        request.setCurrentState("q0");
        
        System.out.println("Initial tape: " + tape.getCells());
        System.out.println("Head position: " + tape.getHeadPosition());
        System.out.println();
        
        int stepCount = 0;
        int maxSteps = 15;
        
        while (stepCount < maxSteps) {
            MachineResponse response = service.step(request);
            
            if (!response.isSuccess()) {
                System.out.println("Error: " + response.getMessage());
                break;
            }
            
            stepCount++;
            System.out.println("Step " + stepCount + ":");
            System.out.println("  Rule: " + response.getExecutedRule().getName());
            System.out.println("  Tape: " + response.getTapes().get(0).getCells());
            System.out.println("  Head: " + response.getTapes().get(0).getHeadPosition());
            System.out.println("  State: " + response.getFinalState());
            System.out.println();
            
            if (response.isHalted()) {
                System.out.println("Machine halted!");
                break;
            }
            
            request.setTapes(response.getTapes());
            request.setCurrentState(response.getFinalState());
        }
        
        System.out.println("=== Test Complete ===");
        System.out.println("Total steps: " + stepCount);
        System.out.println("Final tape: " + request.getTapes().get(0).getCells());
    }
}
