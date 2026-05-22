package com.follarce.server.controller;

import com.follarce.server.dto.MachineRequest;
import com.follarce.server.dto.MachineResponse;
import com.follarce.server.service.TuringMachineService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/machine")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TuringMachineController {

    private final TuringMachineService service;

    public TuringMachineController(TuringMachineService service) {
        this.service = service;
    }

    @PostMapping("/step")
    public MachineResponse step(@RequestBody MachineRequest request) {
        return service.step(request);
    }

    @PostMapping("/run")
    public MachineResponse run(@RequestBody MachineRequest request) {
        return service.run(request);
    }
}
