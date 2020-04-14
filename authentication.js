const DOMParser = require('xmldom').DOMParser;
const express = require('express');
const LoginRouter = express.Router();
const LogoutRouter = express.Router();
const axios = require('axios');

LoginRouter.post('/', async (req, res) => {
	// Validate the token passed by the client
	const response = await axios.get('https://cas-auth.rpi.edu/cas/serviceValidate?' +
		'ticket=' + req.body.ticket + '&service=' + encodeURIComponent(process.env.CAS_SERVICE_URL))

	const doc = new DOMParser().parseFromString(response.data);
	// bad gateway if missing valid non-empty XML response
	if(!doc || !response.data) {
		return res.sendStatus(502);
	}

	const userNodes = doc.getElementsByTagName("cas:user")
	// If a user node exists and has text inside it, respond with that username & a new session cookie
	if(userNodes && userNodes.length > 0 && userNodes[0] && userNodes[0].textContent) {
		return res.json({ username: userNodes[0].textContent.toLowerCase() + "@rpi.edu" });
	}

	const failureNodes = doc.getElementsByTagName("cas:authenticationFailure");
	// If no failure node AND no user node, bad gateway
	if(!failureNodes || failureNodes.length === 0) {
		return res.sendStatus(502);
	}

	const errorCode = failureNodes[0].getAttribute("code");
	res.status(400)
	res.json({ error: errorCode });

});

LogoutRouter.post('/', (req, res, next) => {

});

module.exports = { LoginRouter, LogoutRouter };