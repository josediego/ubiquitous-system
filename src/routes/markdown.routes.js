module.exports = function(app) {
  var markdowns = require('../controllers/markdown.controller.js')
  // Create a new Markdown
  app.post('/markdowns', markdowns.create)

  // Retrieve all Markdowns
  app.get('/markdowns', markdowns.findAll)

  // Retrieve a single Markdown with markdownId
  app.get('/markdowns/:markdownId', markdowns.findOne)

  // Retrieve a single Markdown with markdownId and downloads it
  app.get('/markdowns/:markdownId/download', markdowns.download)

  // Update a Markdown with markdownId
  app.put('/markdowns/:markdownId', markdowns.update)

  // Delete a Markdown with markdownId
  app.delete('/markdowns/:markdownId', markdowns.delete)
}
