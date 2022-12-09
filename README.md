![Logo](./images/ecosonar-logo.webp)

# EcoSonar, the eco-design audit tool

Our official website : https://ecosonar.org

## Main objectives of EcoSonar:
-	Raising the awareness of Delivery teams to environmental issues: enabling development teams to take into account the environmental impact of digital technology during development and to promote knowledge of best eco-design practices
-	Helping developers to implement best eco-design practices: Use of SonarQube, a code analysis tool allowing the implementation of good development practices, in order to extend its functionalities to web eco-design. EcoSonar Audit is based on three open-source tools to analyze the application as it is rendered on a web browser (Google Lighthouse, Green-IT Analysis/EcoIndex and W3C Validator).
-	Get an environmental & performance monitoring solution

# Summary
- [EcoSonar Architecture ](#archi)
- [Prerequisites](#prerequisites)
    - [Infrastructure Requirements](#infra)
- [EcoSonar Configuration](#configuration)
- [Audit Tool](#audit)
    - [GreenIT-Analysis/EcoIndex](#greenit-cnumr)
    - [Google Lighthouse](#ligthhouse)
    - [W3C Validator](#w3c)
- [About](#about)

## EcoSonar Architecture

The EcoSonar tool consists of:
- A containerized Node.js API: allows you to run a GreenIT-Analysis/EcoIndex, Google Lighthouse and W3C Validator analysis for a project containing a list of predefined urls; store and retrieve audits.
- A Sonarqube plugin: launch an EcoSonar analysis by calling the API when a Sonarqube analysis is triggered; adding new pages of a Sonarqube project by retrieving data from the analysis (to learn more about setting up a Sonarqube plugin : https://docs.sonarqube.org/latest/extend/developing-plugin/)
 
![Architecture](./images/ecosonar-architecture.webp)

Example of Architecture deployed on Azure:

 ![Ecosonar Architecture Azure](./images/ecosonar-architecture-azure.webp)

## Prerequisites
- Node.js (v16)

For plugin only:
- Java 11
- Maven 3.8.3
- Sonarqube server minimum version 8.0 (for installation, documentation for a single-node instance: https://docs.sonarqube.org/latest/setup/install-server/ or documentation for cluster: https://docs.sonarqube.org/latest/setup/install-cluster/), no constraint on the edition type. Please check with your infrastructure team which edition are you allowed to use.

### Infrastructure Requirements
- Docker Registry: storage of the Ecosonar API Docker image
- Docker server with RAM > 4Gb necessary for the analysis by Google Lighthouse
- MongoDB database
- Private network: protects the data stored in the database and makes it only accessible to the specified services.
- Subnet associated with the private network: connection between the database and the API
- Vault: store the password to access the database from the API and credentials used to audits pages requiring authentication

## EcoSonar Configuration

For both folders `EcoSonar-API` and `EcoSonar-Sonarqube`, you will find two README.md to get more details on specific details about Ecosonar configuration.

## Audit Tool

### GreenIT-Analysis/EcoIndex

This tool simulates running the extension on specified pages opened in Chromium using Puppeteer to retrieve the results.
The cache system is disabled to make the analysis of a page more reliable.
This tool uses by default the `page.waitForNavigation({waitUntil: 'networkidle2'})` function of Puppeteer in order to wait for a page to finish loading.

### Google Lighthouse

Lighthouse analyzes web pages by collecting performance data and analyzing developer best practices. By default, Lighthouse produces a report in JSON or HTML. We will then store the JSON report in the database to be able to monitor the various performances afterwards.
It is also possible to customize this report to obtain only the desired metrics.

### W3C Validator

The Markup Validator is a free service by W3C that helps check the validity of Web documents. Validating Web documents is an important step which can dramatically help improving and
ensuring their quality, and it can save a lot of time and money. Validating Web Pages is also an important accessibility best practices to resolve (RGAA, criteria 8.2). If the HTML code is
not well formatted, the browser will dynamically correct a certain number of elements to best display the pages causing problems. These dynamic corrections consume resources unnecessarily
each time the pages concerned are loaded.

## About

To get more info on EcoSonar, you can contact ecosonar-team@accenture.com and have a look at our new website : https://ecosonar.org.

To learn more about the audit tools used behind EcoSonar, please have a try of these Chrome Extensions :

For GreenIT-Analysis : https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr

For Google Lighthouse : https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en
or https://developers.google.com/web/tools/lighthouse for other kind of tools

For W3C Validator : https://w3.validator.com 

EcoSonar has been conceived with respect of the licensing rights of the following repository :
https://github.com/cnumr/GreenIT-Analysis-cli.

GreenIT-Analysis licence : https://github.com/cnumr/GreenIT-Analysis-cli/blob/master/LICENSE

EcoIndex licence : https://creativecommons.org/licenses/by-nc-nd/2.0/fr/

Google Lighthouse licence : https://github.com/GoogleChrome/lighthouse/blob/main/LICENSE

W3C Validator licence : https://github.com/zrrrzzt/html-validator/blob/HEAD/LICENSE

To know more on ecodesign best practices, EcoIndex Calculator and how an ecodesign website can be more efficient, please check these two articles from one of our colleagues:

https://blog.octo.com/sous-le-capot-de-la-mesure-ecoindex/

https://blog.octo.com/une-bonne-pratique-vers-un-numerique-plus-responsable-mesurer-le-ressenti-des-internautes/