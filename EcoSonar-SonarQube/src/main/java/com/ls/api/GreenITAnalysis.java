package com.ls.api;

import org.sonar.api.scanner.sensor.ProjectSensor;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.Properties;
import java.util.logging.Logger;

import org.sonar.api.batch.sensor.SensorContext;
import org.sonar.api.batch.sensor.SensorDescriptor;

public class GreenITAnalysis implements ProjectSensor{

    private static final Logger logger = Logger.getLogger(GreenITAnalysis.class.getName());
    @Override
    public void describe(SensorDescriptor descriptor) {
        descriptor.name("GreenIT Analysis");        
    }

    @Override
    public void execute(SensorContext context) {

        try {
            InputStream is = this.getClass().getResourceAsStream("maven.properties");
            Properties p = new Properties();
            p.load(is);
            String baseUrlHosted = p.getProperty("url");
            String route = "/api/greenit/insert";
            String uri = baseUrlHosted + route;
            String projectKey = context.config().get("sonar.projectKey").orElse("");
            String body = "{\"projectName\":\"" + projectKey + "\"}";
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .uri(new URI(uri))
                .build();

            client.send(request, BodyHandlers.ofString());    
        } catch (URISyntaxException| IOException e) {
            logger.info(e.getMessage());
        } catch (InterruptedException e) {
            logger.info(e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
    
}
