# Plugin SonarQube EcoSonar

## Introduction 
This plugin aims to embed EcoSonar Audits, Recommendations as well as Configuration. 
It fulfills three purposes :
- enable automatic trigger of EcoSonar Analysis each time a Sonarqube analysis is done
- static code analysis with green coding rules implemented by EcoCode project
- add EcoSonar audit reports directly into Sonarqube projet User Interface

## Getting Started

### Prerequisites
- Java 11
- Maven 3.8.3
- SonarQube 8.0 or above, Community or other Sonarqube Editions : https://www.sonarqube.org/downloads/

### Build the SonarQube Plugin

#### EcoSonar V2.3 and below

To trigger and retrieve EcoSonar audits, you need to set up in the plugin configuration the URL to reach the EcoSonar API.
Please change in both files `src/main/java/com/ls/api/GreenITAnalysis.java` and `src/main/js/config/axiosConfiguration.js`, the parameter called `baseUrlHosted` to set it with the EcoSonar API Server you use.

To build the plugin JAR file:

```
mvn clean package
```

#### EcoSonar V3.0 and above

To build the plugin JAR file:

For Windows:

```
set REACT_APP_BASE_URL_ECOSONAR_API=#EcoSonar-API-URL
mvn clean package -Durl=#EcoSonar-API-URL
```

For Linux/Mac:

```
export REACT_APP_BASE_URL_ECOSONAR_API=#EcoSonar-API-URL
mvn clean package -Durl=#EcoSonar-API-URL
```

filling the url field will allow you to request directly the EcoSonar-API through environment variable. You do no longer need to modify EcoSonar code.
#EcoSonar-API-URL should be replaced in local by `http://localhost:3000` and by the EcoSonar API Url for a deployed version.

### Install Sonarqube Plugin

Copy the file located at the following path `target/ecosonar-X-SNAPSHOT.jar`.
Go to the downloaded Sonarqube folder  `extensions/plugins/` and paste the JAR.

To finally launch Sonarqube with the plugin, run the shell script: `bin/windows-x86-64/StartSonar.bat`.

 ![Ecosonar Plugin Sonarqube](../images/ecosonar-plugin.webp)

The Sonarqube instance startup logs are located in the file `logs/web.log` 

Official documentation about installing a SonarQube plugin: https://docs.sonarqube.org/latest/setup/install-plugin/.

### Our tip

Set up a CI/CD pipeline to build the executable and automatically add it in the configuration of the Sonarqube server deployed with a script.

### Development of new features in EcoSonar Sonarqube plugin

Check this link : https://docs.sonarqube.org/latest/extend/developing-plugin/

Otherwise feel free to use our code as example with respect of licence.