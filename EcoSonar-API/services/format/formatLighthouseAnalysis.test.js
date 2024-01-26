const formatLighthouseAnalysis = require('./formatLighthouseAnalysis')
const lighthouseReportsDto = require('../../test/lighthouse-report-dto-test.json')
describe('format lighthouse analysis', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('lighthouseAnalysisFormattedDeployments', () => {

        it('should present lighthouse report', () => {
            lighthouseReportsDto.deployments[0].dateLighthouseAnalysis = new Date(lighthouseReportsDto.deployments[0].dateLighthouseAnalysis)
            lighthouseReportsDto.deployments[0].mobile.dateLighthouseAnalysis = new Date(lighthouseReportsDto.deployments[0].mobile.dateLighthouseAnalysis)
            const presentedReports = formatLighthouseAnalysis.lighthouseAnalysisFormattedDeployments(lighthouseReportsDto.deployments)
            expect(presentedReports).toStrictEqual([
                {
                    accessibilityScore: 94,
                    cumulativeLayoutShift: 1,
                    dateAnalysis: new Date('2024-02-02T10:57:24.843Z'),
                    firstContentfulPaint: 100,
                    interactive: 18,
                    largestContentfulPaint: 0,
                    performanceScore: 15,
                    speedIndex: 33,
                    totalBlockingTime: 0,
                    mobile:                 {
                        accessibilityScore: 94,
                        cumulativeLayoutShift: 1,
                        dateAnalysis: new Date('2024-02-02T10:57:24.843Z'),
                        firstContentfulPaint: 100,
                        interactive: 19,
                        largestContentfulPaint: 0,
                        performanceScore: 16,
                        speedIndex: 37,
                        totalBlockingTime: 0
                    }
                }
            ])
        })

    })

    describe('lighthouseProjectLastAnalysisFormatted', () => {

        it('should present lighthouse last analysis', () => {
            lighthouseReportsDto.lastAnalysis[0].dateLighthouseAnalysis = new Date(lighthouseReportsDto.lastAnalysis[0].dateLighthouseAnalysis)
            lighthouseReportsDto.lastAnalysis[0].mobile.dateLighthouseAnalysis = new Date(lighthouseReportsDto.lastAnalysis[0].mobile.dateLighthouseAnalysis)
            const presentedReports = formatLighthouseAnalysis.lighthouseProjectLastAnalysisFormatted(lighthouseReportsDto.lastAnalysis)
            expect(presentedReports).toStrictEqual({
                accessibility: {
                    complianceLevel: "B",
                    displayValue: 94
                },
                cumulativeLayoutShift: {
                    complianceLevel: "G",
                    displayValue: "1.162",
                    score: "1"
                },
                dateAnalysis: new Date('2024-02-02T10:57:24.843Z'),
                firstContentfulPaint: {
                    complianceLevel: "A",
                    displayValue: "0.8 s",
                    score: "100"
                },
                interactive: {
                    complianceLevel: "F",
                    displayValue: "11.5 s",
                    score: "18"
                },
                largestContentfulPaint: {
                    complianceLevel: "G",
                    displayValue: "11.2 s",
                    score: "0"
                },
                performance: {
                    complianceLevel: "F",
                    displayValue: 15
                },
                speedIndex: {
                    complianceLevel: "E",
                    displayValue: "6.9 s",
                    score: "33"
                },
                totalBlockingTime: {
                    complianceLevel: "G",
                    displayValue: "10330 ms",
                    score: "0"
                },
                mobile: {
                    accessibility: {
                        complianceLevel: "B",
                        displayValue: 94
                    },
                    cumulativeLayoutShift: {
                        complianceLevel: "G",
                        displayValue: "1.198",
                        score: "1"
                    },
                    dateAnalysis: new Date('2024-02-02T10:57:24.843Z'),
                    firstContentfulPaint: {
                        complianceLevel: "A",
                        displayValue: "0.8 s",
                        score: "100"
                    },
                    interactive: {
                        complianceLevel: "F",
                        displayValue: "11.4 s",
                        score: "19"
                    },
                    largestContentfulPaint: {
                        complianceLevel: "G",
                        displayValue: "11.1 s",
                        score: "0"
                    },
                    performance: {
                        complianceLevel: "F",
                        displayValue: 16
                    },
                    speedIndex: {
                        complianceLevel: "E",
                        displayValue: "6.6 s",
                        score: "37"
                    },
                    totalBlockingTime: {
                        complianceLevel: "G",
                        displayValue: "10260 ms",
                        score: "0"
                    }
                }
            })
        })

    })
})