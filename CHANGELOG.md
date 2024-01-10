# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Version 3.4 , 11/01/2024

### Added

- Delete a project in EcoSonar
- Retrieve EcoSonar version with a new endpoint
- Retrieve best practices documentation with a new endpoint

### Removed

### Changed

- Change the way to handle the crawler. The crawler request is now asynchronous and you will have two saving options. Either, you can save in a temporary table or you can save directly in the URL configuration table as to be audited by EcoSonar.
- Seperate save login and save proxy as two independent endpoints
- Made easier to launch locally EcoSonar by adding the MongoDB database setup in the Docker Compose file
- Fix bug : insert login without having a procedure
- Fix security vulnerability : upgrade SonarQube dependency to version 9.4 in EcoSonar SonarQube plugin

---

## Version 3.3 , 07/11/2023

### Added

- Integrate new EcoCode features including :
  - additional rules for Python and PHP
  - new languages covered : Javascript, Typescript, Android and iOS
- Implement Swagger User Interface for a more friendly user interface of the API
- Automatically push a new Docker Image as a Github package for each new commit in the 'main' branch of the Github repository
- Add new API Endpoints to retrieve projects scores average at a selected date with filter and sorting configuration

### Removed

### Changed

- Fix some security vulnerabilities

---

## Version 3.2 , 10/08/2023

### Added

- Include Ecocode documentation into EcoSonar website
- Update best practices documentation
- Add MongoDB Community Server connection as a potential database for EcoSonar

### Removed

### Changed

- BUG FIX: user journey flow not working when some CSS selectors are hidden in the page

---

## Version 3.1 , 27/03/2023

### Added

- Integrate EcoCode functionalities : https://www.ecocode.io/.
  EcoCode is a SonarQube plugin developed by a French Open-Source Community `Green Code Initiative` (https://github.com/green-code-initiative) that will add new code smells related to Ecodesign when realizing a SonarQbe audit. Languages covered now are Java, PHP and Python.
- EcoSonar audit can now be exported into an Excel File to be able to share with external people the current status of the website
- Ability to retrieve EcoSonar current Scores: EcoIndex, Lighthouse Performance & Accessibility and W3C Validator
  - Request can be called in a CI/CD Pipeline to prevent production deployment if one of the scores is below a threshold
- Ability to sort EcoSonar Recommandation for EcoDesign Part following 3 different configurations:
  - `scoreImpact` : best practices will be sorted by descending order of implementation (best practices not implemented returned first)
  - `quickWins` : best practices will be sorted by ascending order of difficulty (best practices easy to implement returned first)
  - `highestImpact` : best practices will be sorted by order of impact to improve EcoSonar scores (best practices most efficient returned first)
    Goal of this feature is to help delivery teams tackle recommendations according to their priorities.

### Removed

### Changed

- BUG FIX: When an analysis from one of our tool failed, best practices were saved with default value (0) that could lead to reduce the effective score from the website for that best practice.
- BUG FIX : App should not crashed if an invalid url has been inserted into the user flow configuration in the `navigate` step
- BUG FIX : Getting User flow should be made with parameters : url and projectName if either the same url has been saved severed times into several EcoSonar projects.
- Update EcoSonar dependencies
- Improve EcoSonar Ecodesign and Accessibily Rate

---

---

## Version 3.0 , 09/12/2022

### Added

- W3C Validator Audit available for public pages:
  - Retrieve all errors to improve ecodesign and accessibility levels of web application
  - Scoring methodology: if an error has been resolved, it will increase your w3c score
- Environment Configuration For Sonarqube Plugin to ease deployments
- API Configuration of Login Credentials, dedicated Credentials per project and possibility to save them into database (if security allows it)
- API Configuration of Proxy Configuration per project
- API Configuration of User Flow Configuration, saved into the database (instead of yaml files)

### Removed

### Changed

- Best Practices is divided into 2 seperated sections : Ecodesign and accessibility (previously it was by audit tool)
- BUG FIX: set a default browser viewport in case of unresponsive website to have the right user flow
- BUG FIX: inserting the analysis to the wrong url if one url of the batch fails
- BUG FIX: possiiblity to create a browser for one url audit if user flow is enabled to allow a better cookie management (however performance of the API will decrease - more time to audit all pages)

---

---

## Version 2.3 , 04/10/2022

### Added

- Implement EcoSonar Website to communicate about the tool and detail tool key priorities and solution differentiators
- Set up environment variables in EcoSonar-API to config project throughout deployment instead of modifying directly code
- Implement crawler to detect automatically most pages from your website. The functionality only finds the list of detected urls, you then need to add the ones you want to audit into EcoSonar configuration.
- Add login authentication on multi-pages configuration
- Filter best practices according type of audit (ecodesign, accessibility), audit tool (GreenIT-Analysis, Google Lighthouse Performance and Accessibility) and level of implementation
- Retrieve best practices per URL and per project

### Removed

- Removing greenhouse gas emissions and water consumption because calculation may not be accurate to some IT Systems

### Changed

- Upgrade EcoIndex Calculation : https://github.com/cnumr/GreenIT-Analysis/issues/61
- Upgrading EcoSonar URL Configuration and Best practices pages to resolve some accessibility issues
- Resolve bug fix on "Optimize Bitmap Images"
- Resolve bug fix on "Minify CSS"
- Resolve bug fix on "Image Downloaded and not displayed"

---

---

## Version 2.2 , 03/08/2022

### Added

- Add User Journey and Proxy Configuration Functionalities

### Removed

### Changed

---

---

## Version 2.1 , 26/07/2022

### Added

- Add Authentication functionality to audit intranet pages (all urls registered in the project requires authentication to be access)

### Removed

### Changed

- we have updated the way to register Lighthouse analysis : /!\ new version is not compatible with previous one, you should delete all your analysis before adding this new version.

---

## Version 2.0 , 13/07/2022

### Added

- Add the audits on Performance provided by Google Lighthouse within the list of ecodesign practices to implement : a selection has been made to only keep audits related to ecodesign
- Add the audits on Accessibility provided by Google Lighthouse (based on WCAG)
- Set up for each new audit on Performance and Accessibility some corrections examples as well as documentation
- For Green-IT and Lighthouse Performance audits, add some documentation reference to the RGESN or the book "114 bonnes pratiques d'ecoconception web"
- For each GreenIt Metrics (dom size, number of requests and size of the page), we assigned now a score from 0 to 100 converted to a letter from A to G (scoring method determined thanks to a data analysis)
- For each GreenIt Best Practices, we assigned now a score from 0 to 100 to then retrieve best practices for a project sorted by ascending order (scoring method determined thanks to a data analysis)
- Fixing some bugs
- Keep an history of every GreenIt and Lighthouse audits made

### Removed

### Changed

- /!\ V2 Data Model is no longer compatible with V1 version, sorry about that ...
  You will need to remove analysis saved under bestPractices collection in order to have a working API.
- A New Sonarqube Plugin Version has been set (2.0.0), please make sure to delete previous one (1.0.0) before launching your Sonarqube instance

---

## Version 1.0 , 12/04/2022

### Added

- Possibility to configure manually URL to audit during EcoSonar Analysis
- GreenIT-Analysis/EcoIndex and Google Lighthouse analyses on a series of URL
- Retrieving audit per project by doing average of the different metrics registered
- Retrieving audit per URL
- Retrieving best practices collected using GreenIT-Analysis/EcoIndex for project and sort them by order of implementation

### Removed

### Changed

---
