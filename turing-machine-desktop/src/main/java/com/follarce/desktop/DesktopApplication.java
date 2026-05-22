package com.follarce.desktop;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import java.io.File;

@SpringBootApplication
@ComponentScan(basePackages = "com.follarce")
public class DesktopApplication extends Application {

    private static String[] savedArgs;

    public static void main(String[] args) {
        savedArgs = args;
        Application.launch(DesktopApplication.class, args);
    }

    @Override
    public void start(Stage stage) {
        new Thread(() -> {
            SpringApplication.run(DesktopApplication.class, savedArgs);
        }).start();

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebView webView = new WebView();
        webView.getEngine().setJavaScriptEnabled(true);
        
        File userDataDir = new File(System.getProperty("user.home"), ".turingloom/webview-data");
        if (!userDataDir.exists()) {
            userDataDir.mkdirs();
        }
        webView.getEngine().setUserDataDirectory(userDataDir);
        
        webView.getEngine().load("http://localhost:8888");

        Scene scene = new Scene(webView, 1200, 800);

        stage.setTitle("TuringLoom - 图灵机模拟器");
        stage.setScene(scene);
        stage.show();

        stage.setOnCloseRequest(e -> {
            webView.getEngine().load("about:blank");
            Platform.exit();
            System.exit(0);
        });
    }
}
