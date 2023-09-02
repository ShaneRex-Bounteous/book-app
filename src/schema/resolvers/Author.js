const extractFields = require("../../utils/ExtractFields")

const Author = {
    async books(parent, args, { models }, info) {
        const { book: Book } = models
        try {
            const books = await Book.findAll({
                where: {
                   author_id : parent.id
                },
                attributes: extractFields(info)
            })

            return books
        } catch (error) {
            throw new Error(error.message)
        }
    },
}

module.exports = Author