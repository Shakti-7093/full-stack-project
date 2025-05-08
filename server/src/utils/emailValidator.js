const dns = require('dns');
const validator = require('validator');

const validateEmailDomain = (email) => {
    return new Promise((resolve, reject) => {
        if (!validator.isEmail(email)) {
            return resolve(false);
        }

        const domain = email.split('@')[1];
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                return resolve(false);
            }
            resolve(true);
        });
    });
};

module.exports = validateEmailDomain;