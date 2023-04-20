# RAISE custom learning plan tool

The RAISE custom learning plan tool is developed as part of the [RAISE program](https://evelp.teachsurfing.org/raise-lp/). It will facilitate a way to create rules, based on a questionnaire to individually select units from a course per participant.

## Setup

This repository comes with everything you need to run the RAISE-CLP tool on your own server.

### docker-compose

A sample `docker-compose.yml` file is present in the repositories root. In order to use this, you need to copy the `default.env` file into the `.env` file and fill in the values.

| Key                      | Type    | Description                                                                                                                 |
| ------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Email Settings**       |         |
| MAIL_TO_SENDER_ACTIVE    | boolean | send the user who fills out the questionnaire an email with their results                                                   |
| MAIL_TO_ADMINS           | string  | comma separated list of email addresses that receive a mail with each learning plan when a questionnaire has been submitted |
| SMTP_HOST                | string  | host for SMTP setup                                                                                                         |
| SMTP_PORT                | string  | port for SMTP setup                                                                                                         |
| SMTP_USER                | string  | username for SMTP setup                                                                                                     |
| SMTP_PW                  | string  | password for SMTP setup                                                                                                     |
| SMTP_SENDER              | string  | displayname for SMTP setup                                                                                                  |
| **Paperform field keys** |         |
| EMAIL_KEY                | string  | custom field name in paperform which holds the users email address                                                          |
| NAME_KEY                 | string  | custom field name in paperform which holds the users name                                                                   |
| USER_ID_KEY              | string  | custom field name in paperform which holds the users id                                                                     |
| **Database access**      |         |
| MONGO_URI                | string  | connection string to connect with the mongodb                                                                               |
| **Paperform access**     |         |
| PAPERFORM_ACCESS_TOKEN   | string  | access token for paperform account                                                                                          |

Also please copy the `apps/query-builder/src/assets/config.js` and fill in the values as well.

## Local development

You will need to copy the `default.env` to `.env` and fill in the values for your local environment.

### MongoDB

Also in local development you need to have a running mongoDB database. You can start one locally using docker via running `docker-compose up` from the `tools/dev-db` folder. Alternatively you can connect to a different instance, just keep in mind to set it up in your `.env` file.
