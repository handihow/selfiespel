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
			subject: 'Uitnodiging voor het Selfiespel',
			dynamic_template_data: {
              name: email.toName,
              user: email.fromName
            }
		}
	 	return sgMail.send(msg)
        .then(() => console.log('email sent!') )
        .catch((error) => console.error(error) )

});


