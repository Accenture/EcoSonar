# Plugin SonarQube EcoSonar

## Summary

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Build the EcoSonar SonarQube Plugin](#build)
  - [Install Sonarqube Plugins (EcoSonar + Ecocode) manually](#install)


<a name="introduction"></a>

## Introduction

This plugin aims to embed EcoSonar Audits, Recommendations as well as Configuration.
It fulfills three purposes :

- enable automatic trigger of EcoSonar Analysis each time a Sonarqube analysis is done
- static code analysis with green coding rules implemented by EcoCode project
- add EcoSonar audit reports directly into Sonarqube projet User Interface

<a name="getting-started"></a>

## Getting Started

<a name="prerequisites"></a>

### Prerequisites

- Sonarqube- minimum version 9.4
  https://docs.sonarqube.org/latest/setup/install-server/
  https://docs.sonarqube.org/latest/setup/install-cluster/
  No constraint on the edition type. Please check with your infrastructure team which edition are you allowed to use.
- Java : version 17 if Sonarqube version is 9.9 or above, otherwise version 11
- Maven minimum version 3.8.3

<a name="build"></a>

### Build the EcoSonar SonarQube Plugin 

To build the plugin JAR file, first you need to retrieve the URL of the deployed server for EcoSonar API.
Then run the following commands:

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

If you are running EcoSonar locally, EcoSonar-API-URL should be by default `http://localhost:3000`.

<a name="install"></a>

### Install Sonarqube Plugins (EcoSonar + Ecocode) manually

1. Copy the file located at the following path `EcoSonar-SonarQube/target/ecosonar-X-SNAPSHOT.jar`.
2. Go to your Sonarqube folder `extensions/plugins/` and paste the JAR.
3. Retrieve all JAR files available in the `EcoSonar-SonarQube/ecocode` folder (there should be 6, one by language):
4. Go to your Sonarqube folder `extensions/plugins/` and paste the JAR files to add the EcoCode Sonarqube plugins.

To finally launch Sonarqube with the plugin, run the shell script: `bin/windows-x86-64/StartSonar.bat`.

![Ecosonar Plugin Sonarqube](../images/ecosonar-plugin.webp)

The Sonarqube instance startup logs are located in the file `logs/web.log`

Official documentation about installing a SonarQube plugin: https://docs.sonarqube.org/latest/setup/install-plugin/.

### Our tip

Set up a CI/CD pipeline to build the executable and automatically add it in the configuration of the Sonarqube server deployed with a script.

### Development of new features in EcoSonar Sonarqube plugin

Check this link : https://docs.sonarqube.org/latest/extend/developing-plugin/

Otherwise feel free to use our code as example with respect of licence.
