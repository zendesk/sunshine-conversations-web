(function() {
    "use strict";

    describe("SupportKit", function() {
        it("sanity check", function() {
            expect(true).toBe(true);
        });

        it("should expose the sdk", function() {
            expect(SupportKit).toBeDefined();
            expect(SupportKit.WikiTextHelper).toBeDefined();
        });

        it("should have a method called GetPage", function() {
            expect(SupportKit.GetPage).toBeDefined();
        });

        it("should call the requestSample method when getting a page", function() {
            spyOn(SupportKit, '_requestSample');
            SupportKit.GetPage('Cheese');
            expect(SupportKit._requestSample.calls.length).toEqual(1);
        });
    });

    describe("SupportKit.WikiTextHelper", function() {
        it("should convert a given text to upper case", function() {
            var upperCase = SupportKit.WikiTextHelper._upperCase('some text I got');
            expect(upperCase).toBe('SOME TEXT I GOT');
        });
    });

})();