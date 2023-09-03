const extractFields = require("../../utils/ExtractFields");
const { verifyAuth } = require("../../utils/TokenUtils");

const Query = {
    async allBooks(parent, args, { models, req }, info) {
        const { book: Book, user } = models
        // Build a list of only the requested fields
        // const selectedAttributes = requestedFields.map((fieldName) => Book.rawAttributes[fieldName]);
        // console.log(selectedAttributes);
        try {
            await verifyAuth(req, user)

            const books = await Book.findAll({ attributes: extractFields(info) })
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
        try {
            await verifyAuth(req, user)
            const authors = await Author.findAll({ raw: true, attributes: extractFields(info) })
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