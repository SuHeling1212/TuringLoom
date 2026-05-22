package com.follarce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.follarce.machine.TuringMachine;
import com.follarce.model.*;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public final class TuringMachineApi {

    private TuringMachineApi() {}

    public static MachineConfiguration loadConfiguration(File file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(file, MachineConfiguration.class);
    }

    public static MachineConfiguration loadConfiguration(InputStream inputStream) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(inputStream, MachineConfiguration.class);
    }

    public static MachineConfiguration loadConfiguration(String json) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, MachineConfiguration.class);
    }

    public static TuringMachine createMachine(MachineConfiguration config) {
        return new TuringMachine(config.getRules(), config.getTapes());
    }

    public static TuringMachine createMachine(List<TuringMachineRule> rules, List<TapeState> tapes) {
        return new TuringMachine(rules, tapes);
    }

    public static TuringMachine createMachine(File rulesFile) throws IOException {
        MachineConfiguration config = loadConfiguration(rulesFile);
        return createMachine(config);
    }

    public static String toJson(MachineConfiguration config) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(config);
    }

    public static String toJson(TuringMachineRule rule) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(rule);
    }
}
