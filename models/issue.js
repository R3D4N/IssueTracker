require('dotenv').config();
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);


const issueSchema = new mongoose.Schema({
    issue_title: {
        type: String,
        required: [true, 'must provide a title'],
        trim: true
    },
    issue_text:{
        type: String,
        required: [true, 'must provide a description'],
        trim: true
    },
    created_on:{
        type: Date,
        default: Date.now
    },
    updated_on:{
        type: Date,
        default: Date.now
    },
    created_by:{
        type: String,
        required: [true, 'must provide an auth']
    },
    assigned_to:{
        type: String
    },
    open:{
        type: Boolean,
        default: true
    },
    status_text:{
        type: String
    }
})

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide a project name']
    },
    issueIDs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Issue'
    }]
})

const Issue = mongoose.model('Issue', issueSchema)
const Project = mongoose.model('Project', projectSchema)

module.exports = {Issue, Project}