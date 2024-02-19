const { formatAuditsToBeSaved } = require('./analysisService');
const uniqid = require('uniqid')
const lighthouseDesktopJson = require('../test/lighthouse-report-desktop-test.json')
const lighthouseMobileJson = require('../test/lighthouse-report-mobile-test.json')

jest.mock('uniqid');
describe('analysis service', () => {
    const dateMock = 123456789
    const uniqIdMock = 123456

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(dateMock)
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('formatAuditsToBeSaved', () => {

        it('should format lighthouse audit with mobile', () => {
            uniqid.mockReturnValue(uniqIdMock)

            const reports = {
                reportsLighthouse: [
                    {
                        ...lighthouseDesktopJson,
                        url: 'http://example.com',
                        mobile: {
                            ...lighthouseMobileJson,
                            url: 'http://example.com',
                        }
                    }
                ],
                reportsGreenit: [
                ],
                reportsW3c:[]
            };

            const urlProjectList = [
                {
                    idKey: 'idKey',
                    urlName: 'http://example.com'
                }
            ];

            const formattedAudits = formatAuditsToBeSaved(reports, urlProjectList)

            expect(formattedAudits.analysisLighthouseFormatted).toStrictEqual([
                {
                    accessibility: {
                        complianceLevel: "A",
                        score: 100
                    },
                    cumulativeLayoutShift: {
                        complianceLevel: "A",
                        displayValue: 0.006,
                        score: 100
                    },
                    dateLighthouseAnalysis: dateMock,
                    firstContentfulPaint: {
                        complianceLevel: "A",
                        displayValue: 0.3,
                        score: 100
                    },
                    idLighthouseAnalysis: uniqIdMock,
                    idUrlLighthouse: "idKey",
                    interactive: {
                        complianceLevel: "A",
                        displayValue: 2.8,
                        score: 84
                    },
                    largestContentfulPaint: {
                        complianceLevel: "E",
                        displayValue: 2.9,
                        score: 37
                    },
                    performance: {
                        complianceLevel: "C",
                        score: 67
                    },
                    speedIndex: {
                        complianceLevel: "A",
                        displayValue: 1,
                        score: 97
                    },
                    totalBlockingTime: {
                        complianceLevel: "D",
                        displayValue: 350,
                        score: 50
                    },
                    mobile: {
                        accessibility: {
                            complianceLevel: "G",
                            score: 50
                        },
                        cumulativeLayoutShift: {
                            complianceLevel: "A",
                            displayValue: 0.006,
                            score: 100
                        },
                        dateLighthouseAnalysis: dateMock,
                        firstContentfulPaint: {
                            complianceLevel: "A",
                            displayValue: 0.3,
                            score: 100
                        },
                        idLighthouseAnalysis: uniqIdMock,
                        idUrlLighthouse: "idKey",
                        interactive: {
                            complianceLevel: "A",
                            displayValue: 2.8,
                            score: 84
                        },
                        largestContentfulPaint: {
                            complianceLevel: "E",
                            displayValue: 2.9,
                            score: 37
                        },
                        performance: {
                            complianceLevel: "F",
                            score: 20
                        },
                        speedIndex: {
                            complianceLevel: "A",
                            displayValue: 1,
                            score: 97
                        },
                        totalBlockingTime: {
                            complianceLevel: "D",
                            displayValue: 350,
                            score: 50
                        }
                    }
                }
            ])

        })

    })
})