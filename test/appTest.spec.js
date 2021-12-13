/*
13.12.2021
Jami Seilonen 
Description: Unit tests
*/

const assert = require ('assert');
const funcs = require('../app.js').funcs; 
const app = require('../app.js').app; 
const supertest = require('supertest');

describe('App', () => {
    it('idleState should return idle', function(){
        let result = funcs.idleState();
        assert.equal(result, 'Idle');
    });
    it('idleState should be a string', function(){
        let result = funcs.idleState();
        assert.toString(result, 'Idle');
    });
});

describe('POST /api/status', function done() {
    it('Should has status code 200', async () => {
      supertest(app)
       .post('/api/status')
       .expect(200)
       .end(function(err, res) {
          if (err) done(err);
       });
       done();
     });
  });

describe('POST /api/start', function done() {
it('Machine start successful', async () => {
    supertest(app)
     .post('/api/start')
     .expect(200)
     .end(function(err, res) {
        if (err) done(err);
     });
     done();
   });
});

describe('POST /api/abort', function done() {
    it('Washing aborted', async () => {
        supertest(app)
         .post('/api/abort')
         .expect(200)
         .end(function(err, res) {
            if (err) done(err);
         });
         done();
       });
    });
