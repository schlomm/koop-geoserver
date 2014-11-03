var should = require('should'),
  sinon = require('sinon'),
  config = require('config'),
  request = require('supertest'),
  // we require Koop so we can fake having an actual server running
  koop = require('koop-server')(config);

  // we need koop/lib so we can have access to shared code not exposed directly off the koop object
  kooplib = require('koop-server/lib');

var geoserver;

before(function(done){
  // pull in the provider module
  var provider = require('../index.js');

  // create the model
  geoserver = new provider.model( kooplib );

  // pass the model to the controller
  var controller = new provider.controller( geoserver );

  // bind the default routes so we can test that those work
  koop._bindDefaultRoutes( provider.name, provider.pattern, controller );

  // bind the routes into Koop
  koop._bindRoutes( provider.routes, controller );
  done();
});

after(function(done){
  done();
});

describe('Geoserver Controller', function(){

    describe('get', function() {
      before(function(done ){

        // we stub the find method so we dont actually try to call it
        // we're not testing the model here, just that the controller should call the model
        sinon.stub(geoserver, 'find', function(id, options, callback){
          callback(null, [{
            type:'FeatureCollection',
            features: [{ properties: {}, coordinates: {}, type: 'Feature' }]
          }]);
        });

        done();
      });

      after(function(done){
        // restore the stubbed methods so we can use them later if we need to
        geoserver.find.restore();
        done();
      });

      it('/geoserver/1 should call find', function(done){
        request(koop)
          .get('/geoserver/1')
          .end(function(err, res){
            res.status.should.equal(200);
            //geoserver.find.called.should.equal(true);
            done();
        });
      });
    });

    describe('index', function() {
      it('/geoserver should return 200', function(done){
        request(koop)
          .get('/geoserver')
          .end(function(err, res){
            res.status.should.equal(200);
            done();
        });
      });
    });

    describe('preview', function() {
      it('/geoserver/1/preview should return 200', function(done){
        request(koop)
          .get('/geoserver/1/preview')
          .end(function(err, res){
            res.status.should.equal(200);
            done();
        });
      });
    });

    describe('FeatureServer', function() {
      it('/geoserver/1/FeatureServer should return 200', function(done){
        request(koop)
          .get('/geoserver/1/FeatureServer')
          .end(function(err, res){
            res.status.should.equal(200);
            done();
        });
      });
    });

});
