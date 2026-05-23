package com.follarce.desktop;

import javafx.application.Platform;
import javafx.stage.DirectoryChooser;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class FileService {
    private Stage stage;
    
    public void setStage(Stage stage) {
        this.stage = stage;
    }
    
    public String exportRules(String content) {
        if (stage == null) return "ERROR: Stage not initialized";
        
        CompletableFuture<String> future = new CompletableFuture<>();
        
        Platform.runLater(() -> {
            DirectoryChooser directoryChooser = new DirectoryChooser();
            directoryChooser.setTitle("选择保存目录");
            directoryChooser.setInitialDirectory(new File(System.getProperty("user.home")));
            
            File directory = directoryChooser.showDialog(stage);
            if (directory != null) {
                File file = new File(directory, "turing-machine-rules.json");
                try (FileWriter writer = new FileWriter(file)) {
                    writer.write(content);
                    future.complete("SUCCESS: " + file.getAbsolutePath());
                } catch (IOException e) {
                    future.complete("ERROR: " + e.getMessage());
                }
            } else {
                future.complete("CANCELLED");
            }
        });
        
        try {
            return future.get();
        } catch (InterruptedException | ExecutionException e) {
            return "ERROR: " + e.getMessage();
        }
    }
    
    public String importRules() {
        if (stage == null) return "ERROR: Stage not initialized";
        
        CompletableFuture<String> future = new CompletableFuture<>();
        
        Platform.runLater(() -> {
            FileChooser fileChooser = new FileChooser();
            fileChooser.setTitle("选择规则文件");
            fileChooser.getExtensionFilters().addAll(
                new FileChooser.ExtensionFilter("JSON Files", "*.json"),
                new FileChooser.ExtensionFilter("All Files", "*.*")
            );
            fileChooser.setInitialDirectory(new File(System.getProperty("user.home")));
            
            File file = fileChooser.showOpenDialog(stage);
            if (file != null) {
                try {
                    String content = Files.readString(file.toPath());
                    future.complete(content);
                } catch (IOException e) {
                    future.complete("ERROR: " + e.getMessage());
                }
            } else {
                future.complete("CANCELLED");
            }
        });
        
        try {
            return future.get();
        } catch (InterruptedException | ExecutionException e) {
            return "ERROR: " + e.getMessage();
        }
    }
}
