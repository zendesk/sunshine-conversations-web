/**
 * sdk text helper class
 */
(function(root) {
    root.SupportKit = root.SupportKit || {};
    var SupportKit = root.SupportKit;

    /**
     * @namespace Provides an interface to SupportKit's wiki text processing helper.
     */
    SupportKit.WikiTextHelper = SupportKit.WikiTextHelper || {};

    SupportKit.WikiTextHelper._upperCase = function(content) {
        return content.toUpperCase();
    };
}(window));