JSRamverk backend
===================

This is the backend repository of our project in the course JSRamverk at BTH autumn 2023. A project monitoring the current train traffic in Sweden.

Vulnerabilities
---------------
Found 11 vulnerabilities in versions of:
- debug
- express
- finalhandler
- send
- serve-static
- fresh
- mime
- ms
- node-fetch
- qs
- semver

All fixed with "npm audit fix".

Getting the app to work
---------------
To get the application to work we had to:
- Get an API key from Trafikverket API
- Put the value of the API key as a variable in a .env file
- Add the .env file to .gitignore for safety reasons
- Run the reset_db.bash file

Frontend framework
---------------
We chose the React framework for our project. This because it's the most popular one and therefore seems like a good one to learn. It had less lines of code and smaller file sizes than other frameworks (mostly Angular but in some cases even Vue) and also seems to be one of the easier frameworks to learn and use.
