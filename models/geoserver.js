var request = require('request'),
  BaseModel = require('koop-server/lib/BaseModel.js');

var geoserver = function( koop ){

  var geoserver = {};
  geoserver.__proto__ = BaseModel( koop );


  // adds a service to the koop.Cache.db
  // needs a host, generates an id 
  geoserver.register = function( id, host, callback ){
    var type = 'geoserver:services';
    koop.Cache.db.serviceCount( type, function(error, count){
      id = id || count++;
      koop.Cache.db.serviceRegister( type, {'id': id, 'host': host},  function( err, success ){
        callback( err, id );
      });
    });
  };

  geoserver.remove = function( id, callback ){
    koop.Cache.db.serviceRemove( 'geoserver:services', parseInt(id) || id,  callback);
  }; 

  // get service by id, no id == return all
  geoserver.find = function( id, callback ){
    koop.Cache.db.serviceGet( 'geoserver:services', parseInt(id) || id, callback);
  };

   // got the service and get the item
  geoserver.getResource = function( host, id, options, callback ){
    var self = this,
      type = 'Cloudant',
      key = [host,id].join('::');

    koop.Cache.get( type, key, options, function(err, entry ){
      if ( err ){

        var url = host + '/geoserver/' + id + 'ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + options.view + '&outputFormat=application/json';

        request.get(url, function(e, res){
          var geojson = JSON.parse(res.body);

          // insert data into the cache; assume layer is 0 unless there are many layers (most cases 0 is fine)
          koop.Cache.insert( type, id, geojson, 0, function( err, success){
            if ( success ) {
              callback( null, geojson );
            }
          });
        });
      } else {
        callback( null, entry );
      }
    });
  };



  // drops the item from the cache
  geoserver.dropItem = function( host, itemId, options, callback ){
    var dir = [ 'geoserver', host, itemId].join(':');
    koop.Cache.remove('geoserver:'+host+':', itemId, options, function(err, res){
      koop.files.removeDir( 'files/' + dir, function(err, res){
        koop.files.removeDir( 'tiles/'+ dir, function(err, res){
          koop.files.removeDir( 'thumbs/'+ dir, function(err, res){
            callback(err, true);
          });
        });
      });
    });
  };


  return geoserver;

};

module.exports = geoserver;
