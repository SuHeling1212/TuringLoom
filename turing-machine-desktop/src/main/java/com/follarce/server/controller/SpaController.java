package com.follarce.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    
    @GetMapping(value = {"/", "/other"})
    public String index() {
        return "forward:/index.html";
    }
}
