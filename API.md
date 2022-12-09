**EcoSonar API**
----

**EcoSonar URL Configuration - GET URLs FROM PROJECT**
----

* **URL**

  /api/all?projectName=<PROJECT_NAME>

* **Method:**

  `GET`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
    "url1",
    "url2",
    "url3"]`
 
* **Error Response:**

When you don't have any URLs assigned to a project into EcoSonar

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Your project has no url assigned into EcoSonar. You must at least add one url if you want to analyse ecodesign practices."
    }`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar URL Configuration - INSERT URLs IN PROJECT**
----

* **URL**

  /api/insert 

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

  `{
      "projectName" : "PROJECT_NAME",
      "urlName": ["url1", "url2"]
  }`

* **Success Response:**

  * **Code:** 200 <br />
 
* **Error Response:**

When you have validation errors in the list of urls you want to insert (url not valid, or duplicated)

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": [
        "Url has an invalid syntax",
        "URL was duplicated or already inserted"
    ]
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar URL Configuration - DELETE URL IN PROJECT**
----
You can delete urls only one at a time.

* **URL**

  /api/delete

* **Method:**

  `DELETE`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

  `{
      "projectName" : "PROJECT_NAME",
      "urlName" : "url_to_delete"
  }`

* **Success Response:**

  * **Code:** 200 <br />
 
* **Error Response:**

When the url can't be found in your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "url_to_delete in PROJECT_NAME not found"
  }`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar URL Configuration - GET CRAWLER RESUL**
----

* **URL**

  /api/crawl

* **Method:**

  `GET`
  
*  **URL Params**

None

* **Data Params**
    
    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.
    homepage_url is the home page of your website from where the crawler will start finding all pages within your website

`
{
    "projectName": "PROJECT_NAME",
    "mainUrl": "homepage_url"
}
`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
    "url1",
    "url2",
    "url3"]`
 
* **Error Response:**

When you don't have any URLs assigned to a project into EcoSonar

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Your project has no url assigned into EcoSonar. You must at least add one url if you want to analyse ecodesign practices."
    }`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar LAUNCH ANALYSIS**
----
EcoSonar analysis is launched through this API call either directly or through Sonarqube pipeline. API Call is done asynchronously to avoid performance issue ( ~ 3 seconds to analyse one page)

* **URL**

  /api/greenit/insert

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

  `{
      "projectName" : "PROJECT_NAME"
  }`

* **Success Response:**

  * **Code:** 202 <br />

**EcoSonar ANALYSIS - RETRIEVE ANALYSIS PER PROJECT**
----

* **URL**

  /api/project?projectName=<PROJECT_NAME>

* **Method:**

  `GET`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "allowW3c": "true",
    "deployments": {
        "greenit": [
            {
                "dateAnalysis": "2022-07-18T16:43:03.548Z",
                "domSize": 0,
                "nbRequest": 0,
                "responsesSize": 0,
                "ecoIndex": 0
            }
        ],
        "lighthouse": [
            {
                "performanceScore": 0,
                "accessibilityScore": 0,
                "dateAnalysis": "2022-07-19T14:29:03.713Z",
                "largestContentfulPaint": 0,
                "cumulativeLayoutShift": 0,
                "firstContentfulPaint": 0,
                "speedIndex": 0,
                "totalBlockingTime": 0,
                "interactive": 0
            }
        ],
        "w3c": [
            {
                "score": 0,
                "dateAnalysis": "2022-11-23T14:20:04.888Z"
            }
        ]
    },
    "lastAnalysis": {
        "greenit": {
            "domSize": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "nbRequest": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "responsesSize": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "ecoIndex": 0,
            "grade": "G",
            "waterConsumption": 0,
            "greenhouseGasesEmission": 0
        },
        "lighthouse": {
            "performance": {
                "score": 0,
                "complianceLevel": "G"
            },
            "accessibility": {
                "score": 0,
                "complianceLevel": "G"
            },
            "cumulativeLayoutShift": {
                "score": 0,
                "displayValue": "0",
                "complianceLevel": "G"
            },
            "largestContentfulPaint": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "firstContentfulPaint": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "speedIndex": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "totalBlockingTime": {
                "score": 0,
                "displayValue": "0 ms",
                "complianceLevel": "G"
            },
            "interactive": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            }
        },
        "w3c": {
            "totalInfo": 0,
            "totalWarning": 0,
            "totalError": 0,
            "totalFatalError": 0,
            "score": 0,
            "grade": "F",
            "dateAnalysis": "2022-12-04T21:50:14.353Z"
        }
    }
}`
 
* **Error Response:**

When  no analysis has been done yet on your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "error during generation of PROJECT_NAME analysis"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE ANALYSIS PER URL**
----

* **URL**

  /api/greenit/url

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

  `{
    "projectName" : "PROJECT_NAME",
    "urlName": "url_to_retrieve"
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "deployments": {
        "greenit": [
            {
                "dateAnalysis": "2022-07-18T16:43:03.548Z",
                "domSize": 0,
                "nbRequest": 0,
                "responsesSize": 0,
                "ecoIndex": 0
            }
        ],
        "lighthouse": [
            {
                "performanceScore": 0,
                "accessibilityScore": 0,
                "dateAnalysis": "2022-07-19T14:29:03.713Z",
                "largestContentfulPaint": 0,
                "cumulativeLayoutShift": 0,
                "firstContentfulPaint": 0,
                "speedIndex": 0,
                "totalBlockingTime": 0,
                "interactive": 0
            }
        ],
        "w3c": [
            {
                "score": 0,
                "dateAnalysis": "2022-11-23T14:20:04.888Z"
            }
        ]
    },
    "lastAnalysis": {
        "greenit": {
            "domSize": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "nbRequest": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "responsesSize": {
                "displayValue": 0,
                "complianceLevel": "G"
            },
            "ecoIndex": 0,
            "grade": "G",
            "waterConsumption": 0,
            "greenhouseGasesEmission": 0
        },
        "lighthouse": {
            "performance": {
                "score": 0,
                "complianceLevel": "G"
            },
            "accessibility": {
                "score": 0,
                "complianceLevel": "G"
            },
            "cumulativeLayoutShift": {
                "score": 0,
                "displayValue": "0",
                "complianceLevel": "G"
            },
            "largestContentfulPaint": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "firstContentfulPaint": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "speedIndex": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            },
            "totalBlockingTime": {
                "score": 0,
                "displayValue": "0 ms",
                "complianceLevel": "G"
            },
            "interactive": {
                "score": 0,
                "displayValue": "0 s",
                "complianceLevel": "G"
            }
        },
        "w3c": {
            "totalInfo": 0,
            "totalWarning": 0,
            "totalError": 0,
            "totalFatalError": 0,
            "score": 0,
            "grade": "F",
            "dateAnalysis": "2022-12-04T21:50:14.353Z"
        }
    }
}`
 
* **Error Response:**

When  no analysis has been done yet on your url

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "No lighthouse and greenit analysis found for url url_to_retrieve in project PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE BEST PRACTICES PER PROJECT**
----
Retrieve audits from GreenIt-Analysis and Google Lighthouse aggregated per project.

* **URL**

/api/bestPractices/project?projectName=<PROJECT_NAME>

* **Method:**

  `GET`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "ecodesign": {
        "printStyleSheet": {
            "auditedMetric": "0",
            "compliance": "G",
            "averageScore": 0,
            "description": [],
            "tool": "GreenIT-Analysis"
        },
        "thirdPartyFacades": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "Lighthouse Performance"
        },  
    },
    "dateAnalysisBestPractices": "2022-12-04T21:50:14.353Z",
    "accessibility": {
        "ariaInputFieldName": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "Lighthouse Accessibility"
        },
        "Attribute “xmlns:og” not allowed here.": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [
                {
                    "extract": "",
                    "lineToCorrect": 2
                }
            ],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "W3C validator"
        }
    }
}`
 
* **Error Response:**

When  no analysis has been done yet on your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "No analysis found for PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE BEST PRACTICES PER URL**
----
Retrieve audits from GreenIt-Analysis and Google Lighthouse per url audited.

* **URL**

/api/bestPractices/url

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

  `{
    "projectName" : "PROJECT_NAME",
    "urlName": "url_to_retrieve"
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "ecodesign": {
        "printStyleSheet": {
            "auditedMetric": "0",
            "compliance": "G",
            "averageScore": 0,
            "description": [],
            "tool": "GreenIT-Analysis"
        },
        "thirdPartyFacades": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "Lighthouse Performance"
        },  
    },
    "dateAnalysisBestPractices": "2022-12-04T21:50:14.353Z",
    "accessibility": {
        "ariaInputFieldName": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "Lighthouse Accessibility"
        },
        "Attribute “xmlns:og” not allowed here.": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [
                {
                    "extract": "",
                    "lineToCorrect": 2
                }
            ],
            "compliance": "G",
            "isApplicableOrInformative": true,
            "tool": "W3C validator"
        }
    }
}`
 
* **Error Response:**

When  no analysis has been done yet on your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "No analysis found for url url_to_retrieve into project PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />