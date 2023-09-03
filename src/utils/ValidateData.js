const { GraphQLError } = require("graphql")
const validator = require('validator')

const validateData = (data) => {
    const { email, password } = data

    if (!validator.isEmail(email)) {
        throw new GraphQLError('Invalid email', {
            extensions: {
                code: 'FORBIDDEN',
                http: { status: 403 }
            }
        })
    }

    if(!validator.isLength(password, {
        min: 8,
        max: undefined
    })) {
        throw new GraphQLError('Invalid password', {
            extensions: {
                code: 'FORBIDDEN',
                http: { status: 403 }
            }
        })
    }


    return true
}

module.exports = validateData