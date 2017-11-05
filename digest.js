const request = require('request');
const firebase = require('firebase');

const NEWS_API_URL = "https://newsapi.org/v1/articles";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

let config = {
	apiKey: "AIzaSyCsTL7ZOxNOAUByHQVgGAUIW6OcjXbaCDQ",
	authDomain: "borkedin.firebaseapp.com",
	databaseURL: "https://borkedin.firebaseio.com",
	projectId: "borkedin",
	storageBucket: "borkedin.appspot.com",
	messagingSenderId: "769825906375"
};
let FirebaseApp = firebase.initializeApp(config);
let db = FirebaseApp.database();

function get(url, query) {
	return new Promise((resolve, reject) => {
		request({
			method: 'GET',
			url: url,
			qs: query || {}
		}, (error, response, body) => {
			if (error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});	
}

const ARTICLE_URL = "https://clever-garage.glitch.me/summarize";

function getComicByURL(params) {
	return new Promise((resolve, reject) => {
		get(ARTICLE_URL, params).then((raw) => {
			let res = JSON.parse(raw);
			resolve(res.data);
		}).catch(reject);
	});
}

function getURLHash(url) {
	let hash = url.split('//')[1].split('?')[0].replace(/\W+/g, '');
	return hash;
}

let source = process.argv[2];
console.log(`Updating digest for ${source}`);

db.ref(`newsreel/digests/${source}`).once('value', (snap) => {
	let refs = snap.val() || {};
	get(NEWS_API_URL, {
		apiKey: NEWS_API_KEY,
		source: source
	}).then((body) => {
		let res = JSON.parse(body);
		let urls = res.articles.map(a => a.url).reduce((a, v) => {
			return `${a}\n${v}`;
		}, '');
		console.log(urls);
		res.articles.map(a => {
			return {
				url: a.url,
				hash: getURLHash(a.url)
			}
		}).filter((story) => {
			return !(story.hash in refs);
		}).forEach((story) => {
			getComicByURL({
				url: story.url,
				images: true
			}).then((comic) => {
				if (comic) {
					comic.url = story.url;
					let path = `newsreel/digests/${source}/${story.hash}`;
					db.ref(path).set(comic).then((done) => {
						console.log(`Saved to: ${path}`);
					});
				}
			}).catch((error) => {
				console.error(error);
			});
		});
	}).catch(console.error);
});




