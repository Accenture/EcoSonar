# Plugin SonarQube EcoSonar

## Introduction 
This plugin aims to embed EcoSonar Audits, Recommendations as well as Configuration. 
It fulfills two purposes :
- enable automatic trigger of EcoSonar Analysis each time a Sonarqube analysis is made
- adding EcoSonar audit reports directly into Sonarqube projet UI

## Getting Started

### Prerequisites
- Java 11
- Maven 3.8.3
- SonarQube 8.0 or above, Community or other Sonarqube Editions : https://www.sonarqube.org/downloads/

### Build and run

To build the plugin JAR file:

```
mvn clean package
```

Then copy the file located at the following path `target/ecosonar-2.0-SNAPSHOT.jar`.
Go to the downloaded Sonarqube folder  `extensions/plugins/` and paste the JAR.

To finally launch Sonarqube with the plugin, run the shell script: `bin/windows-x86-64/StartSonar.bat`.

The Sonarqube instance startup logs are located in the file `logs/web.log` 

### Change EcoSonar Configuration

To trigger and retrieve EcoSonar audits, you need to set up in the plugin configuration the URL to reach the EcoSonar API.


Please change in both files `src/main/java/com/ls/api/GreenITAnalysis.java` and `src/main/js/config/axiosConfiguration.js`, the parameter called `baseUrlHosted`.