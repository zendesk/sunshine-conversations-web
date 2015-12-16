import { createMarkup, autolink } from 'utils/html';

describe('createMarkup', () => {
    it('should wrap the give value', () => {
        let value = 'This is my html.';
        let markup = createMarkup(value);

        markup.__html.should.eq(value);
    });
});

describe('autolink', () => {
    it('should wrap urls in <a> tags', () => {
        let value = 'Check out http://some-url.com!';
        let expectedValue = 'Check out <a href="http://some-url.com">http://some-url.com</a>!';

        let transformedValue = autolink(value);

        transformedValue.should.eq(expectedValue);
    });

    it('should add attributes to the tag', () => {
        let value = 'Check out http://some-url.com!';
        let options = {
            target: '_blank',
            class: 'some-class'
        };
        let expectedValue = 'Check out <a target="_blank" class="some-class" href="http://some-url.com">http://some-url.com</a>!';

        let transformedValue = autolink(value, options);

        transformedValue.should.eq(expectedValue);
    });
});
