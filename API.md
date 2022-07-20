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
    "greenItBestPractices": {
        "compressHttp": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "jsValidate": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "maxCookiesLength": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "minifiedCss": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "minifiedJs": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "noRedirect": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "printStyleSheet": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "useETags": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "useStandardTypefaces": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "dontResizeImageInBrowser": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "httpRequests": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 
        },
        "externalizeJs": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "styleSheets": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "addExpiresOrCacheControlHeaders": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "optimizeSvg": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "externalizeCss": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "domainsNumber": {
            "auditedMetric": "0",
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "emptySrcTag": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "httpError": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "imageDownloadedNotDisplayed": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "noCookieForStaticRessources": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "optimizeBitmapImages": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "plugins": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        },
        "socialNetworkButton": {
            "compliance": "G",
            "description": [],
            "averageScore": 0
        }
    },
    "lighthousePerformanceBestPractices": {
        "fontDisplay": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "thirdPartySummary": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "thirdPartyFacades": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "lcpLazyLoaded": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "nonCompositedAnimations": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "layoutShiftElements": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "efficientAnimatedContent": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "usesTextCompression": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "E",
            "isApplicableOrInformative": true
        },
        "unusedCssRules": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "unusedJavascript": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "usesLongCacheTtl": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "serverResponseTime": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "unminifiedJavascript": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [ ],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "modernImageFormats": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "mainthreadWorkBreakdown": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "viewport": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "bootupTime": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "domSize": {
            "auditedMetric": "0",
            "averageScore": 0,
            "description": [],
            "compliance": "G",
            "isApplicableOrInformative": true
        },
        "usesResponsiveImages": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "offscreenImages": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "usesOptimizedImages": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "usesHttp2": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "legacyJavascript": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "totalByteWeight": {
            "auditedMetric": "0",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "noDocumentWrite": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "usesPassiveEventListeners": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "duplicatedJavascript": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        }
    },
    "lighthouseAccesssibilityBestPractices": {
        "ariaCommandName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "tdHeadersAttr": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "validLang": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaInputFieldName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaMeterName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaProgressbarName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaRequiredChildren": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaRequiredParent": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaToggleFieldName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaTooltipName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaTreeitemName": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "definitionList": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "dlItem": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "formFieldMultipleLabels": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "frameTitle": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "inputImageAlt": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "metaRefresh": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "objectAlt": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "thHasDataCells": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "videoCaption": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "accessKeys": {
            "auditedMetric": "N.A",
            "averageScore": 0,
            "description": [],
            "compliance": "N.A",
            "isApplicableOrInformative": false
        },
        "ariaAllowedAttr": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaHiddenBody": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaHiddenFocus": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaRequiredAttr": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaRoles": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaValidAttrValue": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "ariaValidAttr": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "bypass": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "colorContrast": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "documentTitle": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "duplicateIdActive": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "duplicateIdAria": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "headingOrder": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "htmlHasLang": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "htmlLangValid": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "imageAlt": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "label": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "linkName": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "list": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "listItem": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "tabIndex": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "buttonName": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        },
        "metaViewport": {
            "auditedMetric": "N.A",
            "averageScore": 100,
            "description": [],
            "compliance": "A",
            "isApplicableOrInformative": true
        }
    },
    "dateAnalysisBestPractices": "2022-07-18T16:44:19.565Z"
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