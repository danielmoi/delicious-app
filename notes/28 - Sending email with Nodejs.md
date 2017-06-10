- Wes uses mailtrap when sending emails in a development environment
- it fakes being a mail server
- instead of sending it to real users, it just puts it in the mail trap

- after signing up, we have access to the SMTP credentials

- we will use nodemailer = it will interface with SMTP or any number of "transporters" and it will do the sending of emails for you

- a transport is a way of interfacing with ways of sending emails

- text is for our users who don't receive HTML, and only receive TEXT (?!)


- now we send emails!

- now we need to convert PUG to HTML!
- and we need to inline our CSS (as in, not have it in a style tag, but inside each element's STYLE attribute!) - juice will do this for us!!!!!!
-
