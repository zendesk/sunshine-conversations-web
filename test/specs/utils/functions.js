import { pick } from 'utils/functions';

describe('Function utils', () => {

    describe('pick', () => {
        it('should extract the given keys', () => {
            let picked = pick({
                email: 'hello@hello.com'
            }, ['email', 'firstname']);

            picked.should.deep.eq({
                email: 'hello@hello.com'
            });
        });
    });
});
