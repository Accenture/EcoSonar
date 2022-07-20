# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
