// Defines the routes and params name that will be passed in req.params
// routes tell Koop what controller method should handle what request route

module.exports = {
  'post /geoserver': 'register',
  'get /geoserver': 'list',
  'get /geoserver/:id': 'listall',
  'get /geoserver/:id/:item.:format': 'findResource',
  'get /geoserver/:id/:item': 'findResource',
  'post /geoserver/:id/:item': 'findResource',
  'get /geoserver/:id/:item/FeatureServer/:layer/:method': 'featureserver',
  'get /geoserver/:id/:item/FeatureServer/:layer': 'featureserver',
  'get /geoserver/:id/:item/FeatureServer': 'featureserver',
  'post /geoserver/:id/:item/FeatureServer/:layer/:method': 'featureserver',
  'post /geoserver/:id/:item/FeatureServer/:layer': 'featureserver',
  'post /geoserver/:id/:item/FeatureServer': 'featureserver',
  'get /geoserver/:id/:item/thumbnail': 'thumbnail',
  'get /geoserver/:id/:item/tiles/:z/:x/:y.:format': 'tiles',
  'delete /geoserver/:id': 'del',
  'get /geoserver/:id/:item/preview': 'preview',
  'get /geoserver/:id/:item/drop': 'drop'
}
