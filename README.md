# DataWar
## Currently deployed to vrdatalandscape.com
Disclaimer: this is currently still a work in progress
## About this project
Datawar (also known as VR Data Gallery) is a project developed to join together many different technologies for the web. 
It is strictly proof-of-concept, but includes a 3D VR Twitter visualization, a 3D audio equalizer, 
and the use of some fun hardware such as the Wii Balance Board, Kinect, and Oculus Rift DK2.

## Installation & Usage
Running this project is very simple. Upon cloning of the repository, run the following:

    npm install
    node app.js
Then connect to localhost:3000 in your browser

## MongoDB
You will need to use MongoDB for this. If for some reason it doesn't install through npm, install mongodb separately.

Then do this:

    cd server
    sudo mongod

This will start your mongodb server.

## Adding tweets
Tweets will not be added to the scene unless you have some stored in your database. In order to store tweets in your database, do the following from the datawar directory in a separate terminal:

    cd server
    node getTweets.js
This will launch a node app to gather tweets and store them in the database. If you would like to change the keywords you are searching for, open up the getTweets.js file and change the strings in the keywords array.

## Configuring settings
Many settings can be modified in js/config.js

**User settings:**
* *controls*: turns controls list on and off
* *position*: 3D point that determines where you spawn in the scene
* *skeleton*: can modify the look of the user skeleton (Mostly for kinect)
    
**Wii balance board settings:**
* *driftScale*: amount at which you can move left/right on the board
* *driftLimit*: max value you can move left/right
    
**Tweets settings:**
* *retweets*: display retweet nodes on or off
* *maxTweets*: maximum number of tweets (WARNING: If this number is too high the scene will eventually crash your computer. Keep under 150)
* *width*: width of the space in the scene the tweets can take up
* *repulsion*: repulsion is the force at which the nodes push away from eachother
* *spawnTime*: spawn time in ms (WARNING: Do not make this too fast)
* *pollTime*: how often the client connects to the database to pull tweets
    
**Audio settings:**
* *autoplay*: Automatically play the music or not
* *selectedSong*: selected song that plays when the scene loads
    
**Equalizer settings:**
* *animType*: animation style of the equalizer
* *maxHeight*: maximum height of the equalizer
* *minSize*: minimum size of each point
* *maxSize*: maximum size of each point
* *colors*: array of colors for the equalizer, can add more or remove some

## Oculus
Must use Oculus-Rest Server which is included

Go to **oculus-rest-master/bin** to find the binary for your OS or simply run the included Xcode Project or Visual Studio Solution File.

If using OSX, you may need to install libmicrohttpd like this:

    brew install libmicrohttpd


## Authors
Created by Daniel Gillies and Colin Clayton in collaboration with Weidong Yang and Travis Bennett of [Kineviz](http://kineviz.com/)

## Special thanks
* mrdoob, author of [three.js](http://threejs.org/)
* Chandler Prall, author of [physi.js](https://github.com/chandlerprall/Physijs)
* Joyent, Inc. author of [node.js](https://nodejs.org/)
* Tolga Tezel, author of the [Twit API client for node.js](https://github.com/ttezel/twit)
* https://github.com/possan, author of Oculus-Rest-Server
* https://github.com/SoylentGraham, for adding support for Oculus DK2
* Olga Karpenko, our professor at University of San Francisco that allowed us to do this project and kept us on track