# Chat Application

App built with React (frontend) and Express (backend) that pulls data to and from the database [Postgres](http://postgresql.org/).

View Application on [Heroku](https://naamp-twitter-app.herokuapp.com/)

<img src="https://user-images.githubusercontent.com/53867191/101245189-fec39b00-36d8-11eb-9b84-29f82adfe4fc.png" />

<img src="https://user-images.githubusercontent.com/53867191/101245199-10a53e00-36d9-11eb-946e-c9ffff6e576f.png" />

## Summary

This is my second full-stack application.

### Main Functionality

1) Sign-up process - once the user enter their credential and sign up, it sends user data to the backend and the backend further query the database to see whether the username is existed. If not, username and bcrypted password will be saved in the database

2) Log-in process - once the authentication process is complete meaning username and password matchs the database, the backend will create a token and send it back to the client which will be saved in local storage.

3) Posting process - user can only post when they have a valid token which was pulled from user's local storage and send to the backend to verify (authorization process).

4) Real-time chat with multiple users - each user (socket) connects to the backend with socket.io. The backend received a new socket connection everytime each user log in and it will emit new events/messages to all connecting sockets.

Key Takeaways: It's interesting to see the segregation of duties of each part of the applications. I also get to play around debugging tools on VScode which is pretty interesting. Finally, I get to build and understand the whole full-stack process which is awesome!. :)
I've learned so much from this project. so much effort and time into this. the end result feels great. This app help me build confidence that i'm going to be a good full-stack developer.

## Built With

- Environment - [NodeJs](https://nodejs.org/en/)
- Frontend - [ReactJs](https://reactjs.org/) + [Bootstrap](https://getbootstrap.com/) & [Reactstrap](https://reactstrap.github.io/)
- Backend - [ExpressJs](https://expressjs.com/) with [Socket.io](https://socket.io/), [bcrpt](https://www.npmjs.com/package/bcrypt), [JWT](https://jwt.io/)
- Database - [Postgres](http://postgresql.org/)

## Deployment

- [Heroku](https://www.heroku.com)

## Author

- Naam Pondpat - _Full Stack Software Developer_ - [LinkedIn](https://www.linkedin.com/in/naam-pondpat-638153150/)

