package com.follarce.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MachineConfiguration {
    private List<TuringMachineRule> rules;
    
    @JsonProperty("tapeTypes")
    private List<TapeState> tapeTypes;

    public MachineConfiguration() {
        this.rules = new ArrayList<>();
        this.tapeTypes = new ArrayList<>();
    }

    public List<TuringMachineRule> getRules() {
        return rules;
    }

    public void setRules(List<TuringMachineRule> rules) {
        this.rules = rules;
    }

    public List<TapeState> getTapeTypes() {
        return tapeTypes;
    }

    public void setTapeTypes(List<TapeState> tapeTypes) {
        this.tapeTypes = tapeTypes;
    }

    public List<TapeState> getTapes() {
        return tapeTypes;
    }
}
