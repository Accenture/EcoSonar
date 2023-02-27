**EcoSonar API**

New Postman Collection available with all endpoints : 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9592977-29c7010f-0efd-4063-b76a-5b0f455b1829?action=collection%2Ffork&collection-url=entityId%3D9592977-29c7010f-0efd-4063-b76a-5b0f455b1829%26entityType%3Dcollection%26workspaceId%3Df7ed92ee-00aa-4dc1-95aa-9f7d2da44e68)
----

**EcoSonar URL Configuration - GET URLs FROM PROJECT**
----

* **URL**

  `/api/all?projectName=<PROJECT_NAME>`

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

  `/api/insert`

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

When you have validation errors in the list of urls you want to insert (url invalid or duplicated), with the error index corresponding to the index url

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
You can delete one url at a time.

* **URL**

  `/api/delete`

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

**EcoSonar URL Configuration - GET CRAWLER RESULT**
----

* **URL**

  `/api/crawl`

* **Method:**

  `POST`
  
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

EcoSonar API failed to launch crawler:

  * **Code:** 500 Internal Server Error <br />

**EcoSonar LAUNCH ANALYSIS**
----
EcoSonar analysis is launched through this API call either directly with a curl command or Postman request or through a Sonarqube Analysis. API call is done asynchronously to avoid performance issue ( ~ 3 seconds to analyse one page)

* **URL**

  `/api/greenit/insert`

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

  `/api/project?projectName=<PROJECT_NAME>`

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
                "dateAnalysis": "2022-07-19T14:29:03.713Z",
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
                "dateAnalysis": "2022-07-19T14:29:03.713Z"
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
            "responsesSizeUncompress": 0,
            "ecoIndex": 0,
            "grade": "G"
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
            "dateAnalysis": "2023-02-20T13:01:07.977Z",
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
            "grade": "G",
            "dateAnalysis": "2022-07-19T14:29:03.713Z"
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

When an error occured when generating the report

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Error during generation of PROJECT_NAME analysis"
}`

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE ANALYSIS PER URL**
----

* **URL**

  `/api/greenit/url`

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
                "dateAnalysis": "2022-07-18T16:43:03.548Z",
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
                "dateAnalysis": "2022-07-18T16:43:03.548Z"
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
            "grade": "G",
            "dateAnalysis": "2022-07-18T16:43:03.548Z"
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

**EcoSonar ANALYSIS - GET PROJECT SCORES**
----
Retrieve current scores from EcoIndex, Lighthouse Performance and Accessibility and W3C Validator for the project

* **URL**

  `/api/ecosonar/scores?projectName=<PROJECT_NAME>`

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
    **Content:** `
    {
      "ecoIndex": 0,
      "perfScore": 0,
      "accessibilityScore": 0,
      "w3cScore": 0
    }`

* **Error Response:**

When no analysis found for the project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "No Analysis found for project PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE ECOSONAR AUDIT IN EXCEL FORMAT FOR PROJECT**
----
Retrieve audits from GreenIt-Analysis, Google Lighthouse and W3C Validator aggregated per project in an Excel format.

* **URL**

`/api/export`

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

  * **Code:** 200 <br />
    **Content:** Excel file with the exported audit for the project

* **Error Response:**

When an error occured during file generation

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Export Audit is not possible because urls were not inserted into project or analysis for project could not be retrieved"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - SAVE PROCEDURE FOR THE PROJECT**
----
Procedure in Ecosonar are the configuration chosen by delivery teams to sort the EcoSonar recommandations related to ecodesign.
You have 3 different configurations available in EcoSonar:
- `scoreImpact` : best practices will be sorted by descending order of implementation (best practices not implemented returned first)
- `quickWins` : best practices will be sorted by ascending order of difficulty (best practices easy to implement returned first)
- `highestImpact` : best practices will be sorted by order of impact to improve EcoSonar scores (best practices most efficient returned first)

* **URL**

`/api/procedure`

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

  PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.
  selected_procedure can take 3 values : `scoreImpact`, `quickWins`, `highestImpact`

  `{
    "projectName" : "PROJECT_NAME",
    "selectedProcedure": "selected_procedure"
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
      "procedure": "quickWins"
    }`
 
* **Error Response:**

When no procedure have been registered for your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Procedure is not defined in project PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE PROCEDURE SAVED FOR THE PROJECT**
----
Procedure in Ecosonar are the configuration chosen by delivery teams to sort the EcoSonar recommandations related to ecodesign.
This request will return you the procedure chosen for this project.

* **URL**

`/api/procedure?projectName=<PROJECT_NAME>`

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
      "procedure": "quickWins"
    }`
 
* **Error Response:**

When no procedure have been registered for your project

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Procedure is not defined in project PROJECT_NAME"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar ANALYSIS - RETRIEVE BEST PRACTICES PER PROJECT**
----
Retrieve audits from GreenIt-Analysis and Google Lighthouse aggregated per project.

* **URL**

`/api/bestPractices/project?projectName=<PROJECT_NAME>`

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

`/api/bestPractices/url`

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

**EcoSonar Login Configuration - SAVE LOGIN AND PROXY FOR PROJECT**
----

* **URL**

  `/api/login/insert?projectName=<PROJECT_NAME>`

* **Method:**

  `POST`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**
  `{
    "login": {
        "authentication_url":  "",
        "steps": []
    },
    "proxy": {
        "ipAddress": "",
        "port": ""
    }
}`

* **Success Response:**

  * **Code:** 201 <br />
 
* **Error Response:**

EcoSonar API is not able to save into the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar Login Configuration - GET LOGIN FOR PROJECT**
----

* **URL**

  `/api/login/find?projectName=<PROJECT_NAME>`

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
    "authentication_url": "",
    "steps": []
}`
 
* **Error Response:**

When you don't have any login registered for your project into EcoSonar

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Your project does not have login saved into database."
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar Login Configuration - GET PROXY FOR PROJECT**
----

* **URL**

  `/api/proxy/find?projectName=<PROJECT_NAME>`

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
    "ipAddress": "",
    "port": ""
}`
 
* **Error Response:**

When you don't have any proxy registered for your project into EcoSonar

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Your project does not have proxy configuration saved into database."
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar Login Configuration - DELETE LOGIN FOR PROJECT**
----

* **URL**

  `/api/login?projectName=<PROJECT_NAME>`

* **Method:**

  `DELETE`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
 
* **Error Response:**

When you don't have any login registered for your project into EcoSonar and you want still to delete it

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Project not found"
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />


**EcoSonar Login Configuration - DELETE PROXY FOR PROJECT**
----

* **URL**

  `/api/proxy?projectName=<PROJECT_NAME>`

* **Method:**

  `DELETE`
  
*  **URL Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

    **Required:**
  
    `PROJECT_NAME=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar USER FLOW Configuration - GET USER FLOW for URL**
----

* **URL**

  `/api/user-flow/find`

* **Method:**

  `GET`
  
*  **URL Params**

None

* **Data Params**

    PROJECT_NAME should match to the Project Key defined in your Sonarqube Project.

`
{
    "url": "",
    "projectName: "PROJECT_NAME"
}
`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "steps": [
    ]
}`
 
* **Error Response:**

When you don't have any user flow registered for the url into EcoSonar

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Your project does not have user flow saved into database."
}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar USER FLOW Configuration - SAVE USER FLOW for URL**
----

* **URL**

  `/api/user-flow/insert`

* **Method:**

  `POST`
  
*  **URL Params**

None

* **Data Params**

`
{
    "url": "",
    "userFlow": {
    "steps": [
    ]
  }
}
`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "steps": [
    ]
}`
 
* **Error Response:**

You want to add user flow to unexisting url :

  * **Code:** 400 BAD REQUEST  <br />
    **Content:** `{
    "error": "Url not found"
}}`

  OR

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />

**EcoSonar USER FLOW Configuration - DELETE USER FLOW FOR URL**
----

* **URL**

  `/api/user-flow`

* **Method:**

  `DELETE`
  
*  **URL Params**

None

* **Data Params**

`
{
    "url": ""
}
`

* **Success Response:**

  * **Code:** 200 <br />

EcoSonar API is not able to request to the MongoDB Database :

  * **Code:** 500 Internal Server Error <br />