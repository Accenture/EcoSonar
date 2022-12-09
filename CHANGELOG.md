# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
