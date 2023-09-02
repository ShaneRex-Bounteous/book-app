const extractFields = require("../../utils/ExtractFields")

const Query = {
    async allBooks(parent, args, { models }, info) {
        const { book: Book } = models
        // Build a list of only the requested fields
        // const selectedAttributes = requestedFields.map((fieldName) => Book.rawAttributes[fieldName]);
        // console.log(selectedAttributes);
        try {
            const books = await Book.findAll({ attributes: extractFields(info) })
            return books
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async bookById(parent, args, { models }, info) {
        const { book: Book } = models
        try {
            const book = await Book.findByPk(args.id, {
                attributes: extractFields(info)
            })

            return book
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async allAuthors(parent, args, { models }, info) {
        const { author: Author } = models
        try {
            const authors = await Author.findAll({ raw: true, attributes: extractFields(info) })
            return authors
        } catch (error) {
            throw new Error(error.message)
        }
    },
    async authorById(parent, args, { models }, info) {
        const { author: Author } = models
        try {
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