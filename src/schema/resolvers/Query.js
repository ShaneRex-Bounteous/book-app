const extractFields = require("../../utils/ExtractFields");
const { verifyAuth } = require("../../utils/TokenUtils");
const { Op } = require('sequelize')

const Query = {
    async allBooks(parent, args, { models, req }, info) {
        const { book: Book, user } = models
        // Build a list of only the requested fields
        // const selectedAttributes = requestedFields.map((fieldName) => Book.rawAttributes[fieldName]);
        // console.log(selectedAttributes);
        const { offset, limit, after } = args
        try {
            await verifyAuth(req, user)
            const options = {
                attributes: extractFields(info),
                where: {}
            }
            if (offset) {
                options.offset = offset;
            }
            if (limit) {
                options.limit = limit;
            }
            if (after) {
                options.where.id = {
                    [Op.gt]: after
                }
            }
            const books = await Book.findAll(options)
            return books
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async bookById(parent, args, { models, req }, info) {
        const { book: Book, user } = models
        try {
            await verifyAuth(req, user)
            const book = await Book.findByPk(args.id, {
                attributes: extractFields(info)
            })

            return book
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async allAuthors(parent, args, { models, req }, info) {
        const { author: Author, user } = models
        const { offset, limit, after } = args
        try {
            await verifyAuth(req, user)

            const options = {
                attributes: extractFields(info),
                where: {}
            }
            if (offset) {
                options.offset = offset;
            }
            if (limit) {
                options.limit = limit;
            }
            if (after) {
                options.where.id = {
                    [Op.gt]: after
                }
            }
            const authors = await Author.findAll(options)
            return authors
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async authorById(parent, args, { models, req }, info) {
        const { author: Author, user } = models
        try {
            await verifyAuth(req, user)
            const author = await Author.findByPk(args.id, {
                raw: true,
                attributes: extractFields(info)
            })

            return author
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Query