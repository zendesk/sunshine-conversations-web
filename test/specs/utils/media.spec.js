import { isFileTypeSupported } from 'utils/media';

describe('isFileTypeSupported', () => {
    it('should be true for supported types', () => {
        [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp'
        ].forEach((type) => {
            isFileTypeSupported(type).should.be.true;
        });
    });

    it('should be false for non-supported types', () => {
        [
            'file/docx',
            'file/pdf',
            'file/exe',
            'some-file-type'
        ].forEach((type) => {
            isFileTypeSupported(type).should.be.false;
        });
    });
});
