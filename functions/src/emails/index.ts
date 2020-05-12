import * as functions from 'firebase-functions';

import { Email } from '../../../src/app/models/email.model';

const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

export const inviteUserEmail = functions.firestore
	.document('emails/{emailId}')
	.onCreate(event => {
		const email : Email = event.data() as Email;

		const msg = {
			to: email.toEmail,
			from: 'notifications@selfiethegame.com',
			templateId: 'd-9a5d66c38e81434b88a29ce642599833',
			subject: 'Invitation for SelfieTheGame',
			dynamic_template_data: {
              name: email.toName,
              user: email.fromName
            }
		}
	 	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )

});


export const firstReportAbuse = function(toEmail: string, toName: string, teamName: string, assignment: string, gameName: string ) {
	const msg = {
		to: toEmail,
		from: 'notifications@selfiethegame.com',
		templateId: 'd-e39e707ffc6745e380fe73b3e5035938',
		subject: 'Inapproriate Content',
		dynamic_template_data: {
			name: toName,
			teamName: teamName,
			assignment: assignment,
			gameName: gameName
		}
	}
	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )
}

export const secondReportAbuse = function(toEmail: string, toName: string, teamName: string, assignment: string, gameName: string ) {
	const msg = {
		to: toEmail,
		from: 'notifications@selfiethegame.com',
		templateId: 'd-1267f8d848c747cb99af19ce0099c9b3',
		subject: 'Inapproriate Content',
		dynamic_template_data: {
			name: toName,
			teamName: teamName,
			assignment: assignment,
			gameName: gameName
		}
	}
	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )
}

export const thirdReportAbuse = function(toEmail: string, toName: string, teamName: string, assignment: string, gameName: string ) {
	const msg = {
		to: toEmail,
		from: 'notifications@selfiethegame.com',
		templateId: 'd-a1c920190f1c4fd18615b9fed2836020',
		subject: 'Inapproriate Content',
		dynamic_template_data: {
			name: toName,
			teamName: teamName,
			assignment: assignment,
			gameName: gameName
		}
	}
	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )
}

export const officialReportAbuse = function(gameId: string, imageId: string, userEmail: string, adminEmail: string ) {
	const msg = {
		to: 'office@handihow.com',
		from: 'notifications@selfiethegame.com',
		templateId: 'd-91cf48955df94dc695ade5a2ea829b47',
		subject: 'Inapproriate Content',
		dynamic_template_data: {
			gameId: gameId,
			imageId: imageId,
			userEmail: userEmail,
			adminEmail: adminEmail
		}
	}
	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )
}