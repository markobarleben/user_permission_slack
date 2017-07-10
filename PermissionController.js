/**
 * PermissionController.js
 *
 * @description :: Simple Sails Controller that handle User permissions in Slack
 * @docs        :: Check Sails for more Information about Controllers and Models http://sailsjs.org/documentation/
 * Version 0.1
 * 
 * 
 * 
 * ******************** ROUTES ***********************
 * 
 * module.exports.routes = {

  '/main' : 'PermissionController.main',
  '/buttonAction': 'PermissionController.buttonAction',

	};
 *
 * 
 * **************+**** Database *******************
 * 
 * // if user in DB get oauth_token
	checkUser: function(option, cb) {

		var user_id = option.user_id;
		var team_id = option.team_id;

		Permission.find({
				user_id: user_id,
				team_id: team_id
			})
			.exec(function(err, user) {
				if (err) return cb(err);
				cb(null, user);
			})
	},

	// is user not in db create a new user  
	createUser: function(option, cb) {

		var user_id = option.user_id;
		var team_id = option.team_id;
		var oauth_token = option.oauth_token;

		Permission.create({
			user_id: user_id,
			team_id: team_id,
			oauth_token: oauth_token
		}).exec(function(err, user) {
			if (err) return cb(err);
			return cb(null, user);
		})
	},
 * 
 */

var request = require('request');

module.exports = {


	main: function (req, res) {

		var permissionCheck = {

			attachments: [{

				fallback: "Button Action",
				color: '#f9f9f9',
				callback_id: "buttonAction",

				actions: [{
					name: "noPermissionNeeded",
					text: ':smile:',
					type: "button",
					value: 'No permission needed :white_check_mark: because your post is "only visible to you" '
				}, {
					name: "UserPermissionRequired",
					text: " permission :no_entry_sign:",
					type: "button",
					value: 'i ' + ':heart:' + ' :lion_face: '
				}],
			}

			]
		}

		return res.ok(permissionCheck)
	},


	buttonAction: function (req, res) {

		var buttonPayload = req.body.payload
		buttonPayload = JSON.parse(buttonPayload)
		
		if (buttonPayload.actions[0].name === 'noPermissionNeeded') {

			res.ok({ text: buttonPayload.actions[0].value })
		}

		if (buttonPayload.actions[0].name === 'UserPermissionRequired') {
			
		//@ToDo check DataBase (if not User Permission in DB send ask_for_permission) 

			var ask_for_permission = {
				text: 'User Permission is require :no_entry_sign:' + ' Press the link  ' + '<https://slack.com/oauth/authorize?&client_id=' + Slack_Client_ID + '&redirect_uri= Auth_URL ' +
				'&team=' + buttonPayload.team.id + '&scope=chat:write:user| PERMISSION>'
			}

			res.ok(ask_for_permission)

		}
	}
};


