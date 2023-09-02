const extractFields = require("../../utils/ExtractFields")

const Book = {
    async author(parent, args, { models }, info) {
        const {author: Author} = models
        try {
            const author = await Author.findOne({
                where: {
                    id: parent.author_id
                },
                attributes: extractFields(info)
            })

            return author
        } catch (error) {
            throw new Error(error.message)
        }
    },
}

module.exports = Book