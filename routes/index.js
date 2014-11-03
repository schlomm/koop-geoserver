// Defines the routes and params name that will be passed in req.params
// routes tell Koop what controller method should handle what request route

module.exports = {
  // route : handler
  'get /geoserver/:id': 'get'
  'get /geoserver/:id/FeatureServer': 'featureserver'
  'get /geoserver/:id/preview': 'preview'
}
