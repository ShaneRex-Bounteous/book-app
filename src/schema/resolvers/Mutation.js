const extractFields = require("../../utils/ExtractFields")

const Mutation = {
    async createAuthor(parent, args, { sequelize, models }, info) {
        const { author: Author } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
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
    async deleteAuthor(parent, args, { sequelize, models }, info) {
        const { author: Author } = models
        const transaction = await sequelize.transaction()
        try {
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
    async updateAuthor(parent, args, { sequelize, models }, info) {
        const { author: Author } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const author = await Author.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            for(const key in data) {
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
    async createBook(parent, args, { sequelize, models }, info) {
        const { book: Book } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
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
    async deleteBook(parent, args, { sequelize, models }, info) {
        const { book: Book } = models
        const transaction = await sequelize.transaction()
        try {
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
    async updateBook(parent, args, { sequelize, models }, info) {
        const { book: Book } = models
        const { data } = args
        const transaction = await sequelize.transaction()
        try {
            const book = await Book.findByPk(args.id, {
                attributes: ['id', ...extractFields(info)]
            })
            for(const key in data) {
                book[key] = data[key]
            }
            await book.save()
            await transaction.commit()

            return book
        } catch (error) {
            await transaction.rollback()

            throw new Error(error.message)
        }
    }
}

module.exports = Mutation