const mongoose = require('mongoose')

let MarkdownSchema = mongoose.Schema(
  {
    content: String,
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Markdown', MarkdownSchema)
