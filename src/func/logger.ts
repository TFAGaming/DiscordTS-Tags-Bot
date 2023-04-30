export default (message: any, type?: string) => {
    switch (type) {
        case 'error': {
            console.log('\x1b[31m[ERROR]\x1b[0m ' + message);

            break;
        };

        case 'warn': {
            console.log('\x1b[93m[WARNING]\x1b[0m ' + message);

            break;
        };

        case 'info': {
            console.log('\x1b[34m[INFO]\x1b[0m ' + message);

            break;
        };

        case 'success': {
            console.log('\x1b[32m[SUCCESS]\x1b[0m ' + message);

            break;
        };

        default: {
            console.log(message);
        };
    };
};