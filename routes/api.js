'use strict';
const {Issue, Project} = require('../models/issue.js')
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      Project.findOne({name: project}).populate('issueIDs').exec((err, projectData)=>{
        if(err){
          console.log(err);
        }else{
          if(!projectData){
            res.send('')
          }else{
            res.send(projectData.issueIDs)
          }
        }
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issueData = req.body
      Project.findOne({name: project}, (err, dataProject)=>{
        if(err){
          console.log(err);
        }else{
          Issue.create(issueData, (err, dataIssue)=>{
            if(err){
              console.log(err);
            }else{
              if(!dataProject){
                Project.create({name: project, issueIDs: dataIssue._id}, (err,data)=>{
                  if(err){
                    console.log(err);
                  }else{
                    return res.send(dataIssue)
                  }
                })
              }else{
                dataProject.issueIDs.push(dataIssue._id)
                dataProject.save((err)=>{
                  if (err) {
                    console.log(err)
                  }else{
                    return res.send(dataIssue)
                  }
                })
              }
            }
          })
        }
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let data = req.body
      Project.findOne({name: project}, (err, dataProject)=>{
        if(err){
          console.log(err);
        }else{
          if (!dataProject) {
            res.send({msj: 'project name not found'})
          }else{
            Issue.findOneAndUpdate({_id: data._id}, {open: data.open}, {new: true}, (err, issueData)=>{
              if(err){
                console.log(err);
              }else{
                res.send(issueData)
              }
            })
          }
        }
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let data = req.body
      Project.findOne({name: project}, (err, dataProject)=>{
        if(err){
          console.log(err);
        }else{
          if (!dataProject) {
            res.send({msj: 'project name not found'})
          }else{
            Issue.deleteOne({_id: data._id}, (err, issueData)=>{
              if(err){
                console.log(err);
              }else{
                res.send(issueData)
              }
            })
          }
        }
      })
    });
    
};
