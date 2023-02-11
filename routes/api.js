'use strict';
const { Issue, Project } = require('../models/issue.js')
module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let {open, assigned_to} = req.query;
      let query = Project.findOne({ name: project }).populate('issueIDs')
      if(open){
        query = Project.findOne({ name: project }).populate({ 
          path: 'issueIDs',
          match: {open}
        })
      }
      if(assigned_to){
        query = Project.findOne({ name: project }).populate({ 
          path: 'issueIDs',
          match: {assigned_to}
        })
      }
      if(open && assigned_to){
        query = Project.findOne({ name: project }).populate({ 
          path: 'issueIDs',
          match: {open, assigned_to}
        })
      }
      query.exec((err, projectData) => {
        if (err) {
          console.log(err);
        } else {
          if (!projectData) {
            res.send('')
          } else {
            res.send(projectData.issueIDs)
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
      if (!data._id) return res.send({error: 'missing _id'})
      if (Object.keys(data).length <2) return res.send({ error: 'no update field(s) sent', '_id': data._id })
      Project.findOne({ name: project }, (err, dataProject) => {
        if (err) {
          console.log(err);
        } else {
          if (!dataProject) {
            res.send({ msj: 'project name not found' })
          } else {
            Issue.findOneAndUpdate({ _id: data._id }, { open: data.open }, (err, issueData) => {
              if (err) {
                return res.send({ error: 'could not update', '_id': data._id })
              } else {
                res.send({result: 'successfully updated', _id: issueData._id})
              }
            })
          }
        }
      })
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let data = req.body
      Project.findOne({ name: project }, (err, dataProject) => {
        if (err) {
          console.log(err);
        } else {
          if (!dataProject) {
            res.send({ msj: 'project name not found' })
          } else {
            Issue.deleteOne({ _id: data._id }, (err, issueData) => {
              if (err) {
                console.log(err);
              } else {
                res.send(issueData)
              }
            })
          }
        }
      })
    });

};
