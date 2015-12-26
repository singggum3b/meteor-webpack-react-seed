/*Injected webpack stats : WebpackStats && __WebpackDevServerConfig__*/

if (Meteor.isServer) {
	console.log(WebpackStats);
	console.log(__WebpackDevServerConfig__);
}
