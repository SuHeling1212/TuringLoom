package com.follarce.server.controller;

import com.follarce.desktop.FileService;
import com.follarce.desktop.DesktopApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:8888"})
public class FileController {

    @PostMapping("/export")
    public ResponseEntity<Map<String, String>> exportRules(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        if (content == null || content.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No content provided");
            return ResponseEntity.badRequest().body(error);
        }
        
        FileService fileService = DesktopApplication.getFileService();
        String result = fileService.exportRules(content);
        
        Map<String, String> response = new HashMap<>();
        if (result.startsWith("SUCCESS:")) {
            response.put("status", "success");
            response.put("path", result.substring(8));
        } else if (result.equals("CANCELLED")) {
            response.put("status", "cancelled");
        } else {
            response.put("status", "error");
            response.put("error", result);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/import")
    public ResponseEntity<Map<String, String>> importRules() {
        FileService fileService = DesktopApplication.getFileService();
        String result = fileService.importRules();
        
        Map<String, String> response = new HashMap<>();
        if (result.equals("CANCELLED")) {
            response.put("status", "cancelled");
        } else if (result.startsWith("ERROR:")) {
            response.put("status", "error");
            response.put("error", result.substring(6));
        } else {
            response.put("status", "success");
            response.put("content", result);
        }
        
        return ResponseEntity.ok(response);
    }
}
