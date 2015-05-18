"use strict";
var DEBUG = false;   //------------------------------------------------
var config={
	user: {
		controls:true,
		position:{x:0, y:10, z:1000},
		skeleton:{
			scale: 0.01,
			xOffset: 5,
			zOffset: -25,
			boneColor:0xFFFFFF,
			jointColor:0x44ffff
		}
	},
	wii: {
		driftScale: 1/100,
        driftLimit:60
	},
	tweets: {
		retweets:true,
		maxTweets:100,
		width:1600,
		repulsion:0.1,
		spawnTime:500,
		pollTime:50000
	},
	audio: {
		autoplay:false,
		selectedSong:0
	},
	eq:{
		animType:0,
		maxHeight:1000,
		minSize:75,
		maxSize:150,
		colors:[
			0xFF0000, //Red
			0x990099, //Purple
			0x00FF00, //Green
			0xFFFF00, //Yellow
			0x00FF00, //Green
			0xFFFF00, //Yellow
			0x0088FF, //Baby blue
			0xFF00FF, //Red
			0x0088FF, //Baby blue
			0x0000FF, //Dark Blue
			0xFF0000, //Red
			0x00FF00, //Dark Green
			0xFF8800, //Orange
			0xFF00FF, //Fuschia
			0x8800FF, //Dark Green
			0x0000FF //Dark Blue
		]
	}
};