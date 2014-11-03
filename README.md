# DWD-Provider for [Koop](https://github.com/Esri/koop)
-----------
This provider makes it possible to access [geoserver-WFS endpoints](URL HERE) as either a raw geoJSONs output or an ESRI FeatureService.
Because the geoserver already serves geojsons as an output, there is not that much magic about the internal procedure.

### Installation
Perform the following steps to install the dwd-koop provider. Install [koop](https://github.com/Esri/koop) including its dependencies. 
Clone the repo
`git clone git@github.com:Esri/koop.git`
Enter the koop project directory
`cd koop`
Install koop-server and node.js dependencies
`npm install`
Install koop-geoserver provider via
`npm install https://github.com/schlomm/koop-geoserver/tarball/master`


### Quick Go-Through
koop-dwd layers are e accessed by adding the id to /dwd/:dwd_layer_id, and optionally the Feature Service metadata or query. For example:

 - Raw GeoJSON: /geoserver/dwd:BASISWARNUNGEN 
 - FeatureService: /dwd/dwd:BASISWARNUNGEN/FeatureServer/0 
 - Query:  /dwd/dwd:BASISWARNUNGEN/0/query

### Outlook


### Limitations

