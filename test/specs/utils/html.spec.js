import { createMarkup, autolink, escapeHtml } from 'utils/html';

describe('createMarkup', () => {
    it('should wrap the give value', () => {
        const value = 'This is my html.';
        const markup = createMarkup(value);

        markup.__html.should.eq(value);
    });
});

describe('autolink', () => {
    it('should wrap urls in <a> tags', () => {
        const value = 'Check out http://some-url.com!';
        const expectedValue = 'Check out <a href="http://some-url.com">http://some-url.com</a>!';

        const transformedValue = autolink(value);

        transformedValue.should.eq(expectedValue);
    });

    it('should add attributes to the tag', () => {
        const value = 'Check out http://some-url.com!';
        const options = {
            target: '_blank',
            class: 'some-class'
        };
        const expectedValue = 'Check out <a target="_blank" class="some-class" href="http://some-url.com">http://some-url.com</a>!';

        const transformedValue = autolink(value, options);

        transformedValue.should.eq(expectedValue);
    });
});

describe('escapeHtml', () => {
    it('should escape html', () => {
        escapeHtml('<strong>Escape me!</strong>').should.eq('&lt;strong&gt;Escape me!&lt;/strong&gt;');
    });
});
