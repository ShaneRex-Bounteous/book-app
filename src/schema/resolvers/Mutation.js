const extractFields = require("../../utils/ExtractFields")
const { GraphQLError } = require('graphql')
const validateData = require('../../utils/ValidateData')
const { generateToken, verifyAuth, verifyRole } = require("../../utils/TokenUtils")
const { comparePassword } = require("../../utils/PasswordUtils")

const Mutation = {
    async createAuthor(parent, args, { sequelize, models, req }, info) {
        const { author: Author, user: User } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const author = await Author.create(data, {
                raw: true,
                attributes: extractFields(info)
            })

            await transaction.commit()

            return author
        } catch (error) {
            await transaction.rollback()
            throw new Error(error.message)
        }
    },
    async deleteAuthor(parent, args, { sequelize, models, req }, info) {
        const { author: Author, user: User } = models
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const deletedAuthor = await Author.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            await deletedAuthor.destroy()

            await transaction.commit()

            return deletedAuthor
        } catch (error) {
            await transaction.rollback()

            throw new Error(error.message)
        }
    },
    async updateAuthor(parent, args, { sequelize, models, req }, info) {
        const { author: Author, user: User } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const author = await Author.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            for (const key in data) {
                author[key] = data[key]
            }

            await author.save()
            await transaction.commit()

            return author
        } catch (error) {
            await transaction.rollback()

            throw new Error(error.message)
        }
    },
    async createBook(parent, args, { sequelize, models, req }, info) {
        const { book: Book, user: User } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const book = await Book.create(data, {
                raw: true,
                attributes: extractFields(info)
            })

            await transaction.commit()

            return book
        } catch (error) {
            await transaction.rollback()
            throw new Error(error.message)
        }
    },
    async deleteBook(parent, args, { sequelize, models, req }, info) {
        const { book: Book, user: User } = models
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = await verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const deletedBook = await Book.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            await deletedBook.destroy()

            await transaction.commit()

            return deletedBook
        } catch (error) {
            await transaction.rollback()

            throw new Error(error.message)
        }
    },
    async updateBook(parent, args, { sequelize, models, req }, info) {
        const { book: Book, user: User } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const user = await verifyAuth(req, User)
            const isAuthorized = verifyRole(user)
            if(!isAuthorized) {
                throw new GraphQLError('Action not allowed', {
                    extensions: {
                        http: {status: 403},
                        code: 'FORBIDDEN'
                    }
                })
            }
            const book = await Book.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            for (const key in data) {
                book[key] = data[key]
            }
            await book.save()
            await transaction.commit()

            return book
        } catch (error) {
            await transaction.rollback()

            throw new Error(error.message)
        }
    },
    async signup(parent, args, { sequelize, models }, info) {
        const { user: User } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const isValid = validateData(data)
            if (!isValid) {
                throw Error('Invalid data passed')
            }

            const user = await User.create(data, {
                raw: true,
                attributes: extractFields(info)
            })

            await transaction.commit()

            const token = await generateToken(user.id)
            return { user, token }
        } catch (error) {
            await transaction.rollback()
            throw new GraphQLError(error.message, {
                extensions: {
                    http: {
                        status: 403
                    },
                    code: 'FORBIDDEN'
                }
            })
        }
    },
    async login(parent, args, { sequelize, models }, info) {
        const transaction = await sequelize.transaction()
        const { user: User } = models
        const { data } = args
        try {
            const isValid = validateData(data)
            if (!isValid) {
                throw Error('Invalid data passed')
            }
            const user = await User.findOne({
                where: {
                    email: data.email
                }
            })
            await transaction.commit()
            if(!user) {
                throw new Error('User not found')
            }
            const passwordMatch = await comparePassword(data.password, user.password)
            if(!passwordMatch) {
                throw new Error('Invalid password')
            }
            const token = await generateToken(user.id)
            return {user, token}
        } catch (error) {
            throw new GraphQLError(error.message, {
                extensions: {
                    http: {
                        status: 403
                    },
                    code: 'FORBIDDEN'
                }
            })
        }
    }
}

module.exports = Mutation