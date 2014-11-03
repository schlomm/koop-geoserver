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

  geoserver.geoserver_path = '/ckan/api/3/action/package_show';
  geoserver.geoserver_list_path = '/ckan/api/3/action/package_list?-d';

  geoserver.getAll = function( host, options, callback ){
    var self = this;

    var url = host + self.geoserver_list_path,
      result, links = [];
    request.get(url, function(err, data, response ){
      if (err) {
        callback(err, null);
      } else {
        result = JSON.parse(response).result;
        callback( null, result );
      }
    });
  };


  geoserver.find = function( id, options, callback ){

    var type = 'geoserver';

    // check the cache for data with this type & id
    koop.Cache.get( type, id, options, function(err, entry ){
      if ( err){
        // if we get an err then get the data and insert it
        // URL of dwd's WFS geoserver endpoint, which serves geoJSONs
        var url = 'http://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+id+'&outputFormat=application/json';

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
