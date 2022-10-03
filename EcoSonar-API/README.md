# EcoSonar API

This application is based on the GreenIT-Analysis CLI (https://github.com/cnumr/GreenIT-Analysis-cli) and the npm package Google Lighthouse (https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically). Once your API is called, it will trigger both analysis and store them into a MongoDB Database. Then they can be returned to any frontend or our home-made Sonarqube plugin 'EcoSonar'.

# Summary
- [Tool Usecase](#tool-usecase)
  - [GreenIT-Analysis](#greenit-analysis)
  - [Google Lighthouse](#google-lighthouse)
- [To start with](#to-start-with)
  - [MongoDB Database](#mongodb-database)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Node.js](#nodejs)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Docker](#docker)
    - [Prerequisites](#prerequisites)
    - [Usage](#usage)
    - [Proxy configuration](#proxy-configuration)
- [Usage](#usage)
  - [Commande](#commande)
    - [Node.js](#nodejs)
    - [Docker](#docker)
  - [Endpoints](#endpoints)
- [Usage Rights](#usage-rights)

# Tool Usecase

## GreenIT-Analysis

This tool simulates running the extension on specified pages opened in Chromium using Puppeteer to retrieve the results.
The cache system is disabled to make the analysis of a page more reliable.
This tool uses by default the `page.waitForNavigation({waitUntil: 'networkidle2'})` function of Puppeteer in order to wait for a page to finish loading.

## Google Lighthouse

Lighthouse analyzes web pages by collecting performance data and analyzing developer best practices. By default, Lighthouse produces a report in JSON or HTML. We will then store the JSON report in the database to be able to monitor the various performances afterwards.
It is also possible to customize this report to obtain only the desired metrics.

# To start with

To use the tool, you must first check the prerequisites and complete the installation steps.

For this, two different ways to use it:
- Either through a manual installation of Node.js
- Either through Docker

In both cases, it will be necessary to set up a new MongoDB database.

## MongoDB Database

### Prerequisites
 - Mongo DB cloud : https://www.mongodb.com/cloud/atlas/register?utm_content=rlsapostreg&utm_source=google&utm_campaign=gs_emea_rlsamulti_search_brand_dsa_atlas_desktop_rlsa_postreg&utm_term=&utm_medium=cpc_paid_search&utm_ad=b&utm_ad_campaign_id=14412646473&adgroup=131761130372&gclid=EAIaIQobChMIgIeti_OA9AIVmOlRCh3O6gdGEAAYASAAEgJfHvD_BwE

### Installation

If the MongoDB database was not created:
If not, go to the next step.

#### Create a MongoDB Database

1. Open MongoDB Cloud : https://www.mongodb.com/fr-fr/cloud
2. Create an account
3. Blick on "build a database" --> choose free one
    - In "cloud provider & region" choose the closest region in which EcoSonar API is deployed
    - In "cluster" put the name of our database (here "EcoSonar")
4. Click on "Create cluster"
5. Click on "connect"
6. Authorize access
7. Create a username and a password
8. Create a connection with application
    - node.js
    - version 4.0 or later
    - close

### Add Connection to your MongoDB Database

#### On a deployed environment
Add the following environment variables in your Application Configuration:
  - ECOSONAR_ENV_DB_TYPE : MongoDB Type Chosen to store EcoSonar audits. ECOSONAR_ENV_DB_TYPE can take two attributes by default : `MongoDB_Atlas` and `CosmosDB`.
  - ECOSONAR_ENV_USER (user created when initalizing MongoDB database)
  - ECOSONAR_ENV_CLUSTER (cluster name of your MongoDB database)
  - ECOSONAR_ENV_DB_NAME (database name: 'EcoSonar' for example)
  - ECOSONAR_ENV_CLOUD_PROVIDER : Cloud Provider used to deploy EcoSonar API. By default, this parameter can take two values : `AZURE` or `local`. It will be used to retrieve database Password.
  - ECOSONAR_ENV_DB_PORT (port used by your MongoDB database)
  - ECOSONAR_ENV_SONARQUBE_SERVER_URL (url of the Sonarqube Server instantiated and that will send requests to the EcoSonar API)

##### Password Configuration:

1. if `local` was chosen as cloud provider :
  - ECOSONAR_ENV_PASSWORD (password created during the installation of the MongoDB Atlas)

2. if `AZURE` was chosen as cloud provider :
  - ECOSONAR_ENV_KEY_VAULT_NAME : If using Azure as cloud provider to deploy EcoSonar API, you can store your secrets (such as the database password) into a KeyVault and set tu with this environment variable to store the KeyVault name.
  - ECOSONAR_ENV_SECRET_NAME : If using Azure as cloud provider to deploy EcoSonar API, you can set up this environment variable to store the name of your secret for your database password.

#### Locally
Add an .env file at the root of the project, it will contain the local environment variables of the project.
Then choose among the variables below the ones required and add it into .env file.


## Node.js

### Prerequisites
 - Node.js https://nodejs.org/fr/

### Installation
1. Retrieve source code : 
```
git clone https://github.com/Accenture/EcoSonar
```
2. Install npm packages :
```
npm install
```

## Installation through Docker (Note : a licence is now required if you need to use Docker Desktop)

### Prerequisites
 - Docker Desktop for Windows

### Installation

1. Retrieve source code : 
 ```
 git clone https://github.com/Accenture/EcoSonar
 ```
2. Build Docker image : 
 ```
 docker build -t imageName .
 ```

# Usage

## Commande 

### Nodejs
```
npm start
```

API can be reached at: http://localhost:3000

### Docker
```
docker run -p 3000:3000 --name containerName imageName
```

API can be reached at: http://localhost:3000

## Endpoints

You can use for example Postman to send HTTP POST/GET requests to the API.

# Usage Rights

This tool uses an API that does not allow its use for commercial purposes.