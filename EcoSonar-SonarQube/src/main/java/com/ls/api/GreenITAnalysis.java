package com.ls.api;

import org.sonar.api.scanner.sensor.ProjectSensor;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandlers;

import java.util.logging.Logger;
import org.sonar.api.batch.sensor.SensorContext;
import org.sonar.api.batch.sensor.SensorDescriptor;

public class GreenITAnalysis implements ProjectSensor{

    private static final Logger logger = Logger.getLogger(GreenITAnalysis.class.getName());

    //  private String baseUrlLocal = "http://localhost:3000";
    private String baseUrlHosted = "https://sustainability-ecosonar-api.azurewebsites.net";
    private String route = "/api/greenit/insert";

    @Override
    public void describe(SensorDescriptor descriptor) {
        descriptor.name("GreenIT Analysis");        
    }

    @Override
    public void execute(SensorContext context) {
        String projectKey = context.config().get("sonar.projectKey").orElse("");
        //implement switch environment variables according to local or Azure
        String uri = baseUrlHosted + route;
        String body = "{\"projectName\":\"" + projectKey + "\"}";

        try {
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
