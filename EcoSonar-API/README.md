# EcoSonar API

EcoSonar API is an audit aggregator that will use the following open-source audit tools:
- GreenIT-Analysis CLI (https://github.com/cnumr/GreenIT-Analysis-cli)
- Google Lighthouse with a npm package (https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically) 
- W3C Validator with a npm package (https://www.npmjs.com/package/html-validator). This Audit is using right now an external API to audit websites thus can only audit public pages. By default, W3C Validator is disabled for those reasons. However, if you agree to use this external API, please check this section [Enable W3C validator Analysis](#w3c-validator)

Once the EcoSonar audit is triggered, it will launch the three analysis and store them into a MongoDB Database. 
Then, the API can allow you to retrieve pre-formatted audit results using json format. A custom Sonarque Plugin has been created to display the audit directly within the Sonarqube instance. The API can also be used with any other interface that can handle json formats.

API Documentation : https://github.com/Accenture/EcoSonar/blob/main/API.md 

# Summary
- [To start with](#to-start-with)
  - [MongoDB Database](#mongodb-database)
    - [Installation](#installation)
      - [Create a MongoDB Database](#mongodb-creation)
        - [Create a MongoDB Community Server](#mongodb-server) 
        - [Create a MongoDB Atlas Database](#mongodb-atlas)
        - [Create MongoDB Collections](#mongodb-collections)
  - [Node.js](#nodejs)
    - [Prerequisites](#prerequisites-node)
    - [Installation](#installation-node)
  - [Docker](#docker)
    - [Prerequisites](#prerequisites-docker)
    - [Installation](#installation-api)
    - [Our advice for Server Deployment](#docker-deployment)
    - [Add Environment setup](#mongo-setup)
      - [Database configuration](#database-env-var)
      - [CORS Setup](#cors)
      - [Enable W3C validator Analysis](#w3c-validator)
      - [Setup User flow](#user-flow)
- [API Endpoints](#api-endpoints)
- [Authentication Configuration](#auth)
  - [When you have a simple login flow](#simple-login)
    - [EcoSonar V2.3 and below](#old-version-login)
      - [CSS Selectors](#css-slectors)
    - [EcoSonar V3.0 and above](#new-version-login)
  - [More complicated Login flows](#complicated-login)
    - [EcoSonar V2.3 and below](#old-version-login-complicated)
    - [EcoSonar V3.0 and above](#new-version-login-complicated)
- [Proxy Configuration](#proxy)
  - [EcoSonar V2.3 and below](#old-version-proxy)
  - [EcoSonar V3.0 and above](#new-version-proxy)
- [User Flow](#user-flow)
  - [User Flow Creation](#creation)
    - [First method : using Chrome Recorder](#chrome-recorder)
    - [Second method : creating your own User Flow JSON](#custom-user-flow)
  - [User Flow Integration](#integration)
    - [EcoSonar V2.3 and below](#old-version-user-flow)
    - [EcoSonar V3.0 and above](#new-version-user-flow)
  - [User Flow Verification](#verification)
- [Usage Rights](#usage-rights)

<a name="to-start-with"></a>
# To start with

To use the tool, you must first check the prerequisites and complete the installation steps.

For this, two different ways to use it:
- Either through a manual installation of Node.js
- Either through Docker

In both cases, it will be necessary to set up a new MongoDB database.

<a name="mongodb-database"></a>
## MongoDB Database

<a name="installation"></a>
### Installation

If the MongoDB database is already created, you can skip this step and retrieve the relevant information to connect to the database (username, password, cluster, database name).

<a name="mongodb-creation"></a>
#### Create a MongoDB Database
You will need to choose the most adequate MongoDB database according to your infrastructure.
By default, we have implemented connection with 
- MongoDB Community Server : https://www.mongodb.com/try/download/community
- MongoDB Atlas : https://www.mongodb.com/atlas
- Azure CosmosDB : https://azure.microsoft.com/en-us/products/cosmos-db/#overview

For any other MongoDB Database, you will need to set up a new database connection in the file `EcoSonar-API/configuration/database.js`.

<a name="mongodb-server"></a>
##### Create a MongoDB Community Server

1. First you need to install MongoDB Server Community and it is recommended also to install MongoDB Compass for visualization purposes. You can select the following default setup:

 ![MongoDB Server Installation](../images/mongodb-install.webp)

2. Once installation on your laptop is over, you can open MongoDB Compass. You can create a new connection with the default settings:

 ![MongoDB Database Creation](../images/mongodb-connstring.webp)

3. Once you are connected, create a database called ‘EcoSonar’. You might also be required to set at least one collection during database initialization. If so, create collection called ‘bestpractices’. The other collections will be created automatically when you will first launch the API connected to the database.

 ![MongoDB Database Creation](../images/mongodb-dbcreate.webp)

<a name="mongodb-atlas"></a>
##### Create a MongoDB Atlas Database

1. Open MongoDB Cloud : https://www.mongodb.com/fr-fr/cloud
2. Create an account
3. Click on "build a database" --> choose free one
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

<a name="mongodb-collections"></a>
##### Create MongoDB Collections

EcoSonar database will contain the following MongoDB collections: 
- bestpractices
- greenits
- lighthouses
- projects
- urlsprojects
- w3cs

Collections are created automatically when the project is first launched.
However, if you chose Azure CosmoDB for MongoDB Database as database, then you will need to create the following collections with related indexes before starting the project otherwise it will fail. Please find below the different indexes that needs to be added for each collection:
1. bestpractices : `_id`, `idAnalysisBestPractices`, `dateAnalysisBestPractices`
2. greenits : `_id`, `idGreenAnalysis`, `dateGreenAnalysis`
3. lighthouses : `_id`, `idLighthouseAnalysis`, `dateLighthouseAnalysis`
4. projects : `_id`
5. urlsprojects : `_id`, `idKey`
6. w3cs : `_id`, `idW3cAnalysis`, `dateW3cAnalysis`

<a name="nodejs"></a>
## Node.js

<a name="prerequisites-node"></a>
### Prerequisites
 - Node.js https://nodejs.org/fr/ (at least v16)

<a name="installation-node"></a>
### Installation
1. Retrieve source code : 
```
git clone https://github.com/Accenture/EcoSonar
```
2. Go into the Folder EcoSonar-API

3. Install npm packages :
```
npm install
```
4. Launch the API
```
npm start
```

API can be reached at: http://localhost:3000

<a name="docker"></a>
## Docker

<a name="prerequisites-docker"></a>
### Prerequisites
 - Docker Desktop for Windows (Note : a licence is now required if you need to use Docker Desktop at an Enterprise Level)
 - Docker Installed if you are using Mac or Linux

<a name="installation-api"></a>
### Installation

1. Retrieve source code : 
 ```
 git clone https://github.com/Accenture/EcoSonar
 ```
2. Go into the Folder EcoSonar-API
3. Build Docker image : 
 ```
 docker build -t imageName .
 ```
4. Launch a Docker Server :
```
docker container run -d -p 3000:3000 imageName
```

API can be reached at: http://localhost:3000

<a name="docker-deployment"></a>
#### Our advice for Server Deployment
Instead, we recommend setting up a CI/CD pipeline with the following steps:
1. Build the Docker image
2. Push the Docker image into the Docker Registry
3. Stop the server
4. Deploy the server using the newly imported image and correct API configuration
5. Start the server

<a name="mongo-setup"></a>
### Add Environment setup

If you want to run locally the EcoSonar API, you can add an `.env` file at the root of the project, it will contain the local environment variables of the project.
Then choose among the variables below the ones required and add it into `.env` file.

<a name="database-env-var"></a>
#### Database configuration

##### MongoDB Community Server
```
ECOSONAR_ENV_DB_TYPE=’MongoDB’
ECOSONAR_ENV_CLUSTER = 'localhost' or ‘127.0.0.1’
ECOSONAR_ENV_DB_PORT = '27017'
ECOSONAR_ENV_DB_NAME = 'EcoSonar'
```

##### MongoDB Atlas
```
ECOSONAR_ENV_DB_TYPE= ‘MongoDB_Atlas’
ECOSONAR_ENV_CLUSTER = #cluster
ECOSONAR_ENV_DB_NAME = 'EcoSonar'
ECOSONAR_ENV_USER = #user
ECOSONAR_ENV_CLOUD_PROVIDER= ‘local’ (the password will be retrieved from the environment variables)
ECOSONAR_ENV_PASSWORD = #password
```

###### Azure CosmosDB
```
ECOSONAR_ENV_DB_TYPE= ‘CosmosDB’
ECOSONAR_ENV_CLUSTER = #cluster
ECOSONAR_ENV_DB_PORT = #port
ECOSONAR_ENV_DB_NAME = 'EcoSonar'
ECOSONAR_ENV_USER = #user
ECOSONAR_ENV_CLOUD_PROVIDER= ‘AZURE’ (the password will be retrieved from the Azure Key Vault) or ‘local’ (the password will be retrieved from the environment variables)
ECOSONAR_ENV_PASSWORD = #password (if ECOSONAR_ENV_CLOUD_PROVIDER=’local’)
ECOSONAR_ENV_KEY_VAULT_NAME= #keyVaultName (if ECOSONAR_ENV_CLOUD_PROVIDER=’AZURE’)
ECOSONAR_ENV_SECRET_NAME = #keyVaultSecretName (if ECOSONAR_ENV_CLOUD_PROVIDER=’AZURE’)
```

<a name="database-config"></a>
##### Other database configuration possible

If you are not using the same MongoDB database than us, you can develop your own.
Please check to the `EcoSonar-API/configuration/database.js` to set up a different connection string to your database.
We would be very happy if you want to share this new set up in a Pull Request in the Github Repository to enrich the community.
and `EcoSonar-API/configuration/retrieveDatabasePasswordFromCloud.js` for another password manager solution.

<a name="cors"></a>
#### CORS Setup
To improve API Security, CORS options need to be configured to allow any other application to send requests to the API.
To configure it, you can add the following environment variable in your Application Configuration to allow requests coming from your frontend interface:
```
ECOSONAR_ENV_SONARQUBE_SERVER_URL = url of the Sonarqube Server instantiated or any other frontend interface
```

<a name="w3c-validator"></a>
#### Enable W3C validator Analysis
W3C Validator needs to make a request to an external API to audit your url. It means that only 'public' pages can be audited right now. We have raised an issue to the team in charge of W3C Auditor to be able to audit also pages protected by authentication. To be continued...
In the environment variable, you can set the following parameter to request an audit through the external API or not:
```
ECOSONAR_ENV_ALLOW_EXTERNAL_API = take `true`or `false`
```

<a name="user-flow"></a>
#### Setup User flow 
If your projects require to set up a user flow to access some of your web pages, you should then enable this parameter to run audits on dedicated browser to ensure cookies are correctly configured. However, it will increase the audit time of your project.
```
ECOSONAR_ENV_USER_JOURNEY_ENABLED = take `true`or `false`
```

<a name="api-endpoints"></a>
# API Endpoints

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9592977-29c7010f-0efd-4063-b76a-5b0f455b1829?action=collection%2Ffork&collection-url=entityId%3D9592977-29c7010f-0efd-4063-b76a-5b0f455b1829%26entityType%3Dcollection%26workspaceId%3Df7ed92ee-00aa-4dc1-95aa-9f7d2da44e68)

For documentation on available API : https://github.com/Accenture/EcoSonar/blob/main/API.md

<a name="auth"></a>
# Authentication Configuration

In order to audit pages that can be accessed only through an authentication service (intranet pages for example),
you need to add authentication credentials into EcoSonar API to allow auditing dedicated pages.

<a name="simple-login"></a>
## When you have a simple login flow : username, password and click on a button

<a name="old-version-login"></a>
### EcoSonar V2.3 and below
To implement that, you can create a YAML file login.yaml at the root of the folder `EcoSonar-API` and use the following format
if the CSS selector of you input field is `input[name=username]` or `input[type=email]`, password field `input[name=password]`, `input[type=password]`, `input[id=password]` and button `button[type=submit]` : 

```
authentication_url: authenticationPage
username: yourUsername
password: yourPassword
```
or if one of the CSS Selector does not match the default CSS Selectors :

```
authentication_url:authenticationPage
username: yourUsername
password: yourPassword
loginButtonSelector: CSS_Selector_Button
usernameSelector: CSS_Selector_Login
passwordSelector: CSS_Selector_Password
```

<a name="css-slectors"></a>
#### CSS Selectors

CSS Selectors are patterns in HTML code to apply some style (doc ). For exemple, to find the css selector of  loginButtonSelector:
Go to the login page of your website
Right click on the login button
Select inspect
Choose css selectors you want (class, type, name, id, ....)

More Information :

documentation: https://github.com/cnumr/GreenIT-Analysis-cli/blob/072987f7d501790d1a6ccc4af6ec06937b52eb13/README.md#commande
code: https://github.com/cnumr/GreenIT-Analysis-cli/blob/072987f7d501790d1a6ccc4af6ec06937b52eb13/cli-core/analysis.js#L198

<a name="new-version-login"></a>
### EcoSonar V3.0 and above

You can directly configure your login credentials at a project level in the API.
Be careful your login credentials will then be saved into the database, please check with your security team if you are allowed to do so.

You can use the Endpoint "Save Login and Proxy" and enter the following body:

```
{
    "login": {
        "authentication_url":  "authenticationPage",
        "username": "yourUsername",
        "password": "yourPassword"
    }
}
```
or 

```
{
    "login": {
        "authentication_url":  "authenticationPage",
        "username": "yourUsername",
        "password": "yourPassword",
        "loginButtonSelector": "CSS_Selector_Button",
        "usernameSelector": "CSS_Selector_Login",
        "passwordSelector": "CSS_Selector_Password"
    }
}
```
<a name="complicated-login"></a>
## More complicated Login flows

When the Username and password are not in the same page, or you need other user inputs to complete authentication

<a name="old-version-login-complicated"></a>
### EcoSonar V2.3 and below 
If the authentication of the website required steps or a page change, you must follow these requirements:

1. Create a YAML file login.yaml at the root of the repo
2. Add authentication_url key and value is required
3. Add steps key is required
4. Fill steps part as follow

To choose you authentification_url, you can either set it to the page in which you need to perform the authentification steps or pick the page that can only be accessed after being authenticated.

(To help you to create steps, you can use on Google Chrome Tool "Recorder". (inspector -> recorder -> start a new recording) and save json file, then you can extract steps type, target, selectors)

Each step is a description of an action made by a regular user:
- "click" -> Click on a button for example: "submit" or "next"
type: "click" (required)
selector: CSS Selector of the field or button (required)
- "change" -> to fill a field like username or password
type: "change" (required)
selector: CSS Selector of the field or button (required)
value: value of the password or username (required)
/!\ CSS Selectors with "aria" label are not read by EcoSonar.

Example of login.yaml file. to access into an account

```
authentication_url: authenticationPage
steps:
  -   type: "click"
      selectors:
          - "#input-email"
  -   type: "change"
      value: "my email"
      selectors:
          - "#input-email"
  -   type: "click"
      selectors:
        - "#lookup-btn"
  -   type: "change"
      value: "my password"
      selectors:
          - "#input-password"
  -   type: "click"
      selectors:
        - "#signin-button"
```

<a name="new-version-login-complicated"></a>
### EcoSonar V3.0 and above

You can use directly to configure your login credentials at a project level in the API.

You can use the Endpoint "Save Login and Proxy" and enter the following body:

```
{
    "login": {
        "authentication_url":  "authenticationPage",
        "steps" : [ ....]
    }
}
```

<a name="proxy"></a>
# Proxy Configuration 

For some websites, you may need to configure a proxy in order to access it.
You need to seperate the analysis that are made with or without a proxy into several EcoSonar projects.

<a name="old-version-proxy"></a>
## EcoSonar V2.3 and below 
To implement that, you can create a YAML file proxy.yaml at the root of the repo.
Please find below the configuration format :

``` 
ipaddress: ipAddress
port: port
projectName: (optional)
  - PROJECT_NAME_1
  - PROJECT_NAME_2
```
 
ipaddress : IP Address of your proxy
port : port of your proxy

projectName : list of EcoSonar Projects (corresponding to Sonarqube projectKey) that needs a proxy to audit pages registered. If no projectName has been added but proxy.yaml file exists, then proxy will be applied by default to all your projects.

<a name="new-version-proxy"></a>
## EcoSonar V3.0 and above

You can directly configure your login credentials at a project level in the API.

You can use the Endpoint "Save Login and Proxy" and enter the following body:

```
{
    "proxy": {
        "ipAddress":  "ipAddress",
        "port" : "port"
    }
}
```

<a name="user-flow"></a>
# User Flow 

In order to audit some pages, sometimes you may need to go through a user flow to get access to that page (for exemple fill in a form). Otherwise, if you don't have the context, the page can not be accessed.
We have added this functionality into EcoSonar.

<a name="creation"></a>
## User Flow Creation

<a name="chrome-recorder"></a>
### First method : using Chrome Recorder

If your business allows to use Chrome Browser, we hightly recommend you to use this method.
Chrome has a native panel called "Recorder" that allows you to record, replay and measure user flows (https://developer.chrome.com/docs/devtools/recorder/).

 ![Chrome Recorder](../images/chrome-recorder.webp)

 To access this panel, please click right on your browser, select Inspect, then choose Recorder in the DevTools Panel.
 
To start recording a user flow, you can then click on button "Start new recording",  choose a name then click on "Start a new recording".

 ![Start Chrome Recorder](../images/chrome-start-recorder.webp)

 Then the Chrome browser is going to register every interaction that is made with the page and save it into the user flow.
 
For example, we want to audit this page : http://www.ecometer.org/job?url=https%3A%2F%2Fwww.accenture.com%2Ffr-fr. It is only accessible if you are launching an analysis of the website with Ecometer :
1. You need to navigate to the page : http://www.ecometer.org/
2. You need to change the input to have your URL.
3. You need to click on the button "Analyse" to launch the analysis.

 ![Chrome Recorder User flow](../images/chrome-recorder-result.webp)

Chrome Recorder is going to register the user flow by saving every step/interaction.
 
To make sure your user flow is correct and can be used through Ecosonar, please use "Replay" button and start from initial page to make sure the User flow automation is set up correctly. You should have the result as your previous manual configuration.
 
/!\ Be Careful "click" steps are not duplicated in your userflow (same element triggered) otherwise it could not have the expected behaviour. You can remove step in the Recorder by clicking on the 3 dots.
 
Once you have validated your userflow, you can export this User Flow using the export button and choose JSON.

 ![Chrome Recorder User flow export](../images/save-chrome-recorder.webp)

<a name="custom-user-flow"></a>
### Second method : creating your own User Flow JSON

If you are not allowed to use Chrome Browser, you can edit manually the user flow JSON file created by Chrome Recorder.
It should have the following format :
```
{​​​​​​​​
    "steps": [
    {​​​​
      "type": "navigate",
      "url": "http://www.ecometer.org/",
    }​​​​​​​​​​​​​​​​​​,
   {​​​​​​​​​​​​​​​​​​​​​​
      "type": "click",
      "selectors": [
        [
          "body > div.container.begin > div > form > input.url"
        ]
      ],
    }​​​​​​​​​​​​​​​​​​​​​​,
        {​​​​​​​​​​​​​​​​​​​
      "type": "change",
      "value": "https://www.accenture.com/fr-fr",
      "selectors": [
        [
          "body > div.container.begin > div > form > input.url"
        ]
      ],
    }​​​​​​​​​​​​​​​​​​​,
    {​​​​​​​​​​​​​​​​​​​
      "type": "click",
      "selectors": [
        [
          "body > div.container.begin > div > form > input.button"
        ]
      ],
      ]
    }​​​​​​​​​​​​​​​​​​​
    ]
}​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ 
```
 
We are handling into EcoSonar 3 kind of browser interactions :
1. Navigate to a URL 
It should have "type" = "navigate" and "url" the url you want to go to
2. Change an input field
"type" = "change", "value" : value to be set in the input field, "selectors" : list of CSS Selectors to find the right input field
3. Click on a button 
"type" = "click",  "selectors" : list of CSS Selectors to find the right button

<a name="integration"></a>
## User Flow Integration

<a name="old-version-user-flow"></a>
### EcoSonar v2.3 and below

Once you have been able to define the JSON file matching to your user flow, you can followed instructions:

1. Create a folder "userJourney" if it does not exists yet at the root of the folder `EcoSonar-API`.
2. Paste JSON file created in the folder "userJourney" and rename it with the URL you wish to audit. Please remove the following special character `:` `?` `:` `/` from the URL in order to save the JSON. To retrieve the user flow we are matching it with the URL registered through EcoSonar URL Configuration. This step is not to forget otherwise EcoSonar won't be auditing the right page.
3. Deploy EcoSonar-API with all relevant user flows.
4. Launch a new EcoSonar audit to verify there are no technical errors in the logs application. Correct them if needed.

<a name="new-version-user-flow"></a>
### EcoSonar v3.0 and above

With version 3.0, you can directly configure the user flow in the API provided (no longer need to reboot the instance)
You can use the Endpoint "Save User Flow" and enter the following body:

```
{
    "url": "urlToAudit,
    "userFlow": {
      "steps": [ ....]
    }
}
```

<a name="verification"></a>
## User Flow Verification

To verify pages you audit are the correct ones, we suggest you to use both Chrome extensions : Green-IT Analysis (https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr) and Google Lighthouse (https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=fr) and compare results from these extensions to the EcoSonar audits. There should be almost identical.
If that is not the case, do not hesitate to contact us to help you.

<a name="usage-rights"></a>
# Usage Rights

This tool uses an API that does not allow its use for commercial purposes.