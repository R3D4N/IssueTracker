const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // #1
  test('Post required and optionally fields', function(done){
    chai
        .request(server)
        .post('/api/issues/test')
        .send({
            'issue_title': 'fourth',
            'issue_text': 'post test 1',
            'created_by': 'angelo',
            'assigned_to': 'sandra',
            'status_text': 'test'
        })
        .end(function(err, res){
            assert.isNotNull(res.text , 'Post with all data')
            done()
        })
  })
  // #2
  test('Post required fields', function(done){
    chai
        .request(server)
        .post('/api/issues/test')
        .send({
            'issue_title': 'fifth',
            'issue_text': 'post test 2',
            'created_by': 'angelo'
        })
        .end(function(err, res){
            assert.isNotNull(res.text , 'Post with all data')
            done()
        })
  })
  // #3
  test('Post with missing required fields', function(done){
    chai
        .request(server)
        .post('/api/issues/test')
        .send({
            'issue_title': 'fifth',
            'issue_text': 'post test 2'
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"error":"required field(s) missing"}', 'Post with all data')
            done()
        })
  })
  // #4
  test('Get request for an array of all issues', function(done){
    chai
        .request(server)
        .get('/api/issues/test')
        .end(function(err, res){
            assert.isNotNull(res.text, 'Get all issues data')
            done()
        })
  })
  // #5
  test('Get request with one filter', function(done){
    chai
        .request(server)
        .get('/api/issues/test?open=false')
        .end(function(err, res){
            assert.isNotNull(res.text, 'Get issues with one filter')
            done()
        })
  })
  // #6
  test('Get request with one filter', function(done){
    chai
        .request(server)
        .get('/api/issues/test?open=true&assigned_to=camila')
        .end(function(err, res){
            assert.isNotNull(res.text, 'Get issues with multiple filters')
            done()
        })
  })
  // #7
  test('Put request update one field', function(done){
    chai
        .request(server)
        .put('/api/issues/test')
        .send({
            '_id': '63e5eae0901336f1631a512f',
            'open': true
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"result":"successfully updated","_id":"63e5eae0901336f1631a512f"}')
            done()
        })
  })/*
  // #8 todo
  test('Put request update multiple fields', function(done){
    chai
        .request(server)
        .put('/api/issues/test')
        .send({
            '_id': '63e5eae0901336f1631a512f',
            'open': true
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"result":"successfully updated", "_id":"63e5eae0901336f1631a512f"}', 'Put with all data')
        })
  })*/
  // #9
  test('Put request with missing _id', function(done){
    chai
        .request(server)
        .put('/api/issues/test')
        .send({
            'open': true
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"error":"missing _id"}', 'Put without _id')
            done()
        })
  })
  // #10
  test('Put request with no fields to update', function(done){
    chai
        .request(server)
        .put('/api/issues/test')
        .send({
            '_id': '63e5eae0901336f1631a512f'
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"error":"no update field(s) sent","_id":"63e5eae0901336f1631a512f"}', 'Put without field to update')
            done()
        })
  })
  // #11
  test('Put request with a wrong _id', function(done){
    chai
        .request(server)
        .put('/api/issues/test')
        .send({
            '_id': '63e5eaeff01336f1631a512f',
            'open': true
        })
        .end(function(err, res){
            assert.strictEqual(res.text, '{"error":"could not update","_id":"63e5eaeff01336f1631a512f"}', 'Put with wrong _id')
            done()
        })
  })
});
