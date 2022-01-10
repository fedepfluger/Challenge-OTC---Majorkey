require('cypress-xpath')
/// <reference types="cypress" />
/// <reference types="cypress-xpath" />

describe('Mayor Key Challenge by Federico Pflüger', () => {
    const DOM_SEARCH_INPUT = '//input[@placeholder="Quote"][not(ancestor::*[@id="otc_footer"])]';
    //The dynamic XPath (line 24) is considered more representative as it is left commented
    //const DOM_SEARCH_OPTION = '//div[div/input[@placeholder="Quote"][not(ancestor::*[@id="otc_footer"])]]/div[2]//div[2]';
    const DOM_QUOTE_TAB = '//a[text()="Quote"]';
    const DOM_SECURITY_DETAILS_TAB = '//a[text()="Security Details"]';
    const DOM_QUOTE_OPEN = '//div[label/text()="Open"]/p';
    const DOM_QUOTE_MARKET_CAP = '//div[span/span/label/text()="Market Cap"]//p';
    const DOM_COMPANY_SYMBOL = '//h1[1]';
    const DOM_COMPANY_NAME = '//h1[2]';
    const DOM_SECURITY_DETAILS_MARKET_CAP = '//div[h4/text()="Share Structure"]/div[2]/div[2]';
    const DOM_SECURITY_DETAILS_MARKET_CAP_DATE = '//div[h4/text()="Share Structure"]/div[2]/div[3]';

    // 12 - Perform above Scenario for 3 companies: "RHHBY", "OTCM", "ADBCF",
    [
        "RHHBY",
        "OTCM",
        "ADBCF",
    ].forEach((name) => {
        const DOM_SEARCH_OPTION = '//div[text()="' + name + '"][not(ancestor::*[@id="otc_footer"])]';


        it ('Challenger - Automate the workflow - ' + name, function() {

            // 1 - Navigate the www.otcmarkets.com
            cy.log('1 - Navigate the www.otcmarkets.com');
            cy.visit('https://www.otcmarkets.com');
    
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                if (err.message.includes('Cannot read properties of undefined')) {
                    return false
                }
            })

            // 2/3 - Look up for “OTCM” quote in quote textbox
            cy.log('2/3 - Look up for “OTCM” quote in quote textbox');
            cy.xpath(DOM_SEARCH_INPUT).type(name);

            // not listed - Get the company name
            cy.xpath(DOM_SEARCH_OPTION).then($company => {
                const company_name = $company.text();
                cy.wrap(company_name.split(" - ")[1]).as('company_name');
            })
            cy.xpath(DOM_SEARCH_OPTION).click();

            // 4 - Navigate to “Quote” tab
            cy.log('4 - Navigate to “Quote” tab');
            cy.xpath(DOM_QUOTE_TAB).click();

            // 5/6 - Capture – Open/Market Cap
            cy.log('5/6 - Capture – Open/Market Cap');
            cy.wait(2000);
            cy.xpath(DOM_QUOTE_OPEN).then($open => {
                cy.wrap($open.text()).as('quote_open');
            })
            cy.xpath(DOM_QUOTE_MARKET_CAP).then($m_cap => {
                cy.wrap($m_cap.text()).as('quote_market_cap');
            })

            // 7 - Assert the Company Name and Symbol
            cy.log('7 - Assert the Company Name and Symbol');
            cy.xpath(DOM_COMPANY_NAME).then($name => {
                expect($name.text()).to.equal(this.company_name);
            })
            cy.xpath(DOM_COMPANY_SYMBOL).then($symbol => {
                expect($symbol.text()).to.equal(name);
            })

            // 8 - Navigate to “Security Details” tab
            cy.log('8 - Navigate to “Security Details” tab');
            cy.xpath(DOM_SECURITY_DETAILS_TAB).click();

            // 9 - Capture – Market Cap Value and Date
            cy.log('9 - Capture – Market Cap Value and Date');
            // This is another way to capture the text, but it does not show the text captured in the report so it is left commented
            // cy.xpath(DOM_SECURITY_DETAILS_MARKET_CAP).invoke('text').as('sd_market_cap')
            // cy.xpath(DOM_SECURITY_DETAILS_MARKET_CAP_DATE).invoke('text').as('sd_market_cap_date')
            cy.xpath(DOM_SECURITY_DETAILS_MARKET_CAP).then($m_cap => {
                const sd_market_cap = $m_cap.text();
                cy.wrap(sd_market_cap).as('sd_market_cap');
                
                // 10 - Assert Market Cap on Quote Page matches with Security Detail Page
                cy.log('10 - Assert Market Cap on Quote Page matches with Security Detail Page');
                expect(this.quote_market_cap).to.equal(sd_market_cap);
            })
            cy.xpath(DOM_SECURITY_DETAILS_MARKET_CAP_DATE).then($date => {
                // 11 - Print log “Market Cap $x on $date”
                cy.log('11 - Print log “Market Cap $x on $date”');
                cy.log("Market Cap " + this.sd_market_cap + " on " + $date.text());
            })
        })
    })
})
