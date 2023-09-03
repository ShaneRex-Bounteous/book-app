const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const getTokenFromHeader = (req) => {
    try {
        const header = req.headers.authorization
        if (!header) {
            throw Error('No headers found')
        }

        if (!header.startsWith('Bearer')) {
            throw Error('No Bearer token found')
        }
        const token = header.split(" ")[1]

        return token
    } catch (error) {
        throw new Error(error.message)
    }
}

const generateToken = (id) => {
    try {
        const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: "1h"
        })

        return token
    } catch (error) {
        throw new Error('Cannot create token')
    }
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {
            throw new Error('Invalid token')
        }

        return decoded.id
    } catch (error) {
        throw new Error(error.message)
    }
}

const verifyAuth = async (req, User) => {
    try {
        const token = getTokenFromHeader(req)

        const userId = verifyToken(token, User)
        const user = await User.findByPk(userId, {
            raw: true,
            attributes: ['role']
        })

        if (!user) {
            throw new Error('No user found')
        }

        return user
    } catch (error) {
        throw new GraphQLError(error.message, {
            extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 401 }
            }
        })
    }
}

const verifyRole = (user) => {
    return user.role === 'admin'
}

module.exports = {
    generateToken,
    verifyToken,
    getTokenFromHeader,
    verifyAuth,
    verifyRole
}