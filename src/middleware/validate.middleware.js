const sendResponse = require('../utils/sendResponse');

const z = require('zod')


const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            sendResponse(res, 400, 'Validation failed',
                err.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            );
        } else {
            console.log(err)
            sendResponse(res, 400, 'Validation failed', [{
                field: 'unknown',
                message: 'An unexpected error occurred during validation.'
            }]);
        }
    }
};


module.exports = validateSchema