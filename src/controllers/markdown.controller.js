const Markdown = require("../models/markdown.model.js")

exports.create = function(req, res) {
  // Create and Save a new Markdown
  let content = JSON.parse(req.rawBody).content || ""
  if (!content) {
    return res.status(400).send({
      message: "Markdown can not be empty"
    })
  }

  let markdown = new Markdown({
    content: content
  })

  markdown.save(function(err, data) {
    if (err) {
      console.log(err)
      res.status(500).send({
        message: "Some error occurred while creating the Markdown."
      })
    } else {
      res.send(data)
    }
  })
}

exports.findAll = function(req, res) {
  // Retrieve and return all markdowns from the database.
  Markdown.find({
    deleted: false
  })
    .sort({
      updatedAt: -1
    })
    .exec(function(err, markdowns) {
      if (err) {
        console.log(err)
        res.status(500).send({
          message: "Some error occurred while retrieving markdowns."
        })
      } else {
        res.send(markdowns)
      }
    })
}

exports.findOne = function(req, res) {
  // Find a single markdown with a markdownId
  Markdown.findById(req.params.markdownId, function(err, markdown) {
    if (err) {
      console.log(err)
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Markdown not found with id " + req.params.markdownId
        })
      }
      return res.status(500).send({
        message: "Error retrieving markdown with id " + req.params.markdownId
      })
    }

    if (!markdown) {
      return res.status(404).send({
        message: "Markdown not found with id " + req.params.markdownId
      })
    }

    res.send(markdown)
  })
}

exports.download = function(req, res) {
  // Find a single markdown with a markdownId and downloads it with .md extension
  Markdown.findById(req.params.markdownId, function(err, markdown) {
    if (err) {
      console.log(err)
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Markdown not found with id " + req.params.markdownId
        })
      }
      return res.status(500).send({
        message: "Error retrieving markdown with id " + req.params.markdownId
      })
    }

    if (!markdown) {
      return res.status(404).send({
        message: "Markdown not found with id " + req.params.markdownId
      })
    }

    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + markdown._id + ".md"
    )
    res.setHeader("Content-type", "text/plain")
    res.write(markdown.content, function(err) {
      res.end()
    })
  })
}

exports.update = function(req, res) {
  // Update a markdown identified by the markdownId in the request
  let content = JSON.parse(req.rawBody).content || ""
  if (!content) {
    return res.status(400).send({
      message: "Markdown can not be empty"
    })
  }

  Markdown.findById(req.params.markdownId, function(err, markdown) {
    if (err) {
      console.log(err)
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Markdown not found with id " + req.params.markdownId
        })
      }
      return res.status(500).send({
        message: "Error finding markdown with id " + req.params.markdownId
      })
    }

    if (!markdown) {
      return res.status(404).send({
        message: "Markdown not found with id " + req.params.markdownId
      })
    }

    markdown.content = content

    markdown.save(function(err, data) {
      if (err) {
        res.status(500).send({
          message: "Could not update markdown with id " + req.params.markdownId
        })
      } else {
        res.send(data)
      }
    })
  })
}

exports.delete = function(req, res) {
  // Delete a markdown with the specified markdownId in the request
  Markdown.findById(req.params.markdownId, function(err, markdown) {
    if (err) {
      console.log(err)
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Markdown not found with id " + req.params.markdownId
        })
      }
      return res.status(500).send({
        message: "Error finding markdown with id " + req.params.markdownId
      })
    }

    if (!markdown) {
      return res.status(404).send({
        message: "Markdown not found with id " + req.params.markdownId
      })
    }

    markdown.deleted = true

    markdown.save(function(err, data) {
      if (err) {
        res.status(500).send({
          message: "Could not update markdown with id " + req.params.markdownId
        })
      } else {
        res.send(data)
      }
    })
  })
}
