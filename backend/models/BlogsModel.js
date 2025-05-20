const mongoose = require('mongoose');


const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            MaxLength: 100
        },
        content: {
            type: String,
            maxLength: 10000,
        },
        tags: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        }
    },
    {
        timestamps: true
    }
)

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = BlogModel;