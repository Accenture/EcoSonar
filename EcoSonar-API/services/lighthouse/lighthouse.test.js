const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse')
const authenticationService = require('../authenticationService');
const userJourneyService = require('../userJourneyService');
const lighthouseAnalysis = require('./lighthouse');

jest.mock('puppeteer');
jest.mock('lighthouse');
jest.mock('../authenticationService');
jest.mock('../userJourneyService');

describe('lighthouseAnalysis function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should analyze URLs with Lighthouse', async () => {
        // given
        puppeteer.launch.mockResolvedValue({
            close: jest.fn(),
            wsEndpoint: jest.fn().mockReturnValue('ws://example.com'),
        });
        authenticationService.loginIfNeeded.mockResolvedValue(true);

        userJourneyService.getUserFlow.mockResolvedValue(undefined);
        userJourneyService.playUserFlowLighthouse.mockResolvedValue({ /* lighthouse results */ });

        lighthouse.mockResolvedValueOnce({
            lhr: {
                categories: [
                    {
                        speedIndex:   {
                            score: 50
                        }
                    }
                    ]
            }
        }).mockResolvedValueOnce({
            lhr: {
                categories: [
                    {
                        speedIndex:   {
                            score: 30
                        }
                    }
                ]
            }
        })

        // when
        const result = await lighthouseAnalysis.lighthouseAnalysis(['http://example.com'], 'projectName');

        // then
        expect(result).toStrictEqual([{
            categories: [
                {
                    speedIndex: {
                        score: 50
                    }
                }
            ],
            mobile: {
                categories: [
                    {
                        speedIndex: {
                            score: 30
                        }
                    }
                ],
                url: 'http://example.com'
            },
            url: 'http://example.com'
        }]);
    });
});