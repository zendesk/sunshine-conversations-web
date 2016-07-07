import ReactTelInput from 'react-telephone-input';

export class TelephoneInput extends ReactTelInput {
    getFlagStyle = () => {
        return {
            width: 32,
            height: 24,
            backgroundSize: 'contain',
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat'
        };
    }
}
