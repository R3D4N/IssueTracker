'use strict';
const { Issue, Project } = require('../models/issue.js')
module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let data = req.query;
      let query = Project.findOne({ name: project }).populate({ path: 'issueIDs', select: '-__v' })
      if (data) {
        query = Project.findOne({ name: project }).populate({
          path: 'issueIDs',
          match: { ...data },
          select: '-__v'
        })
      }
      query.exec((err, projectData) => {
        if (err) {
          console.log(err);
        } else {
          if (!projectData) {
            res.send('')
          } else {
            res.json(projectData.issueIDs)
          }
        }
      })
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issueData = req.body
      Project.findOne({ name: project }, (err, dataProject) => {
        if (err) {
          console.log(err);
        } else {
          Issue.create(issueData, (err, dataIssue) => {
            if (err) {
              return res.send({ error: 'required field(s) missing' })
            } else {
              if (!dataProject) {
                Project.create({ name: project, issueIDs: dataIssue._id }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    return res.send(dataIssue)
                  }
                })
              } else {
                dataProject.issueIDs.push(dataIssue._id)
                dataProject.save((err) => {
                  if (err) {
                    console.log(err)
                  } else {
                    return res.send(dataIssue)
                  }
                })
              }
            }
          })
        }
      })
    })

    .put(function (req, res) {
      let project = req.params.project;
      let data = req.body
      if (!data._id) return res.send({ error: 'missing _id' })
      if (Object.keys(data).length < 2) return res.send({ error: 'no update field(s) sent', '_id': data._id })
      Project.findOne({ name: project }, (err, dataProject) => {
        if (err) {
          console.log(err);
        } else {
          if (!dataProject) {
            res.send({ msj: 'project name not found' })
          } else {
            data.updated_on = Date.now()
            Issue.findOneAndUpdate({ _id: data._id }, data, (err, issueData) => {
              if (err || !issueData) {
                return res.send({ error: 'could not update', '_id': data._id })
              }
              res.send({ result: 'successfully updated', _id: issueData._id })
            })
          }
        }
      })
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let data = req.body
      if (!data._id) return res.send({ error: 'missing _id' })
      Project.findOne({ name: project }, (err, dataProject) => {
        if (err || !dataProject) {
          res.send({ msj: 'could not found project name', error: err })
        } else {
          Issue.deleteOne({ _id: data._id }, (err, d) => {
            if (err || d.deletedCount == 0) {
              return res.send({ error: 'could not delete', _id: data._id })
            }
            let index = dataProject.issueIDs.indexOf(data._id)
            if (index > -1) {
              dataProject.issueIDs.splice(index, 1)
            }
            dataProject.save((err, result) => {
              if (err) console.log(err);
            })
            res.send({ result: 'successfully deleted', _id: data._id })
          })
        }
      })
    });

};
