#!/bin/bash
sudo USE_DATABASE=true MONGO_CONNECTION=localhost:27017/stats-inspector node app.js
#sudo USE_DATABASE=false node app.js