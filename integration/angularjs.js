/* AngularJS + RESTangular integration

This script detects (on page load) if one of the slack user of the support dedicated channel is active on slack.
If there's one or more active user it toggle the chat.

If you're not using restangular, you can just check the simplejs file or install it : https://github.com/mgonto/restangular

Get your Slack API token and channel ID there : https://api.slack.com/web
*/

var app = angular.module('studio',['restangular']);


// Restangular service to access Slack API (non mandatory)
app.factory('SlackRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('https://slack.com/api/');
  });
});

app.run(function($rootScope, Restangular, SlackRestangular){

  $rootScope.supportKit('your slack API token here','your channel ID here');

	$rootScope.supportKit = function(token,channel){
		SlackRestangular.one("channels.info?token="+token+"&channel="+channel+"&pretty=1").get().then(function(result){

			for (var i in result.channel.members) {
				SlackRestangular.one("users.getPresence?token="+token+"&user="+result.channel.members[i]+"&pretty=1").get().then(function(member){
					//Check member activity
					if(member.presence === "active"){
						$rootScope.supportStatus++;
					}
					//if support is available toggle live chat
					if($rootScope.supportStatus > 0){
						SupportKit.init({appToken: 'your support token here'});
					}
				});
			};
		});
	};

});
