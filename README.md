# Chat Application

App built with React (frontend) and Express (backend) that pulls data to and from the database [Postgres](http://postgresql.org/).

View Application on [Heroku](https://naamp-chat-app.herokuapp.com/)

<img src="https://user-images.githubusercontent.com/53867191/101245189-fec39b00-36d8-11eb-9b84-29f82adfe4fc.png" />

<img src="https://user-images.githubusercontent.com/53867191/101245199-10a53e00-36d9-11eb-946e-c9ffff6e576f.png" />

## Summary

This is my second full-stack application.

### Main Functionality

1) Sign-up process - once the user enters their credential and signs up, it sends user data to the backend, and the backend further query the database to see whether the username exists. If not, username and bcrypted password will be saved in the database

2) Log-in process - once the authentication process is completed meaning username and password match the database, the backend will create a token and send it back to the client which will be saved in local storage.

3) Posting process - the user can only post when they have a valid token which was pulled from the user's local storage and send to the backend to verify (authorization process).

4) Real-time chat with multiple users - each user (socket) connects to the backend with socket.io. The backend received a new socket connection every time each user logs in and it will emit new events/messages to all connecting sockets.

Key Takeaways: I've learned so much from this project technically and mentally. I learn so many aspects of server-side programming and also how to be persistent and keep going even though things are rough at times. And, the final result makes me feel great!

## Built With

- Environment - [NodeJs](https://nodejs.org/en/)
- Frontend - [ReactJs](https://reactjs.org/) + [Bootstrap](https://getbootstrap.com/) & [Reactstrap](https://reactstrap.github.io/)
- Backend - [ExpressJs](https://expressjs.com/) with [Socket.io](https://socket.io/), [bcrpt](https://www.npmjs.com/package/bcrypt), [JWT](https://jwt.io/)
- Database - [Postgres](http://postgresql.org/)

## Deployment

- [Heroku](https://www.heroku.com)

## Local Installation Directions

First install the project's dependencies and scripts in the root directory run the command:

``` npm i```

then cd into client and run the same command:

``` npm i```

To start the app locally, run this command in the root directory:

``` npm run start```

## Author

- Naam Pondpat - _Full Stack Software Developer_ - [LinkedIn](https://www.linkedin.com/in/naam-pondpat-638153150/)

