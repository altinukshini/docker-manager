# Docker Manager

A simple node, express and reactjs app to manage and monitor docker containers in a local machine.

## Requirements

Install ```docker``` in your local machine and create some containers to test...

Maybe a good start point would be installing portainer: https://portainer.io/install.html

## Install/Usage

```
npm install
```

and

```
npm start
```
this will start concurrently a node server that listens to the linux socket and communicates with docker api (default on port 3001) and the reactjs app on port 3000.


