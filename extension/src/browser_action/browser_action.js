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

function getURLHash(url) {
	let hash = url.split('//')[1].split('?')[0].replace(/\W+/g, '');
	return hash;
}

const COMIC_URL = "https://clever-garage.glitch.me/comic";

function getComicFromArticle(article) {
	return new Promise((resolve, reject) => {
		$.get(COMIC_URL, article).then((res) => {
			console.log(res);
			resolve(res.data);
		}).catch(reject);
	});
}

function renderComic(comic) {
	let output = document.createElement('div');
		output.classList.add('comic-holder');
		
	let tileSizes = ['is-5', 'is-7', 'is-7', 'is-5'];
	let tileClasses = ['light-blue', 'light-yellow', 'light-red'];
	let panesPerLine = 2;

	console.log(comic);

	let parent = false;

	let h = document.createElement('h2');
		h.classList.add('title');
		h.classList.add('heading');
		h.classList.add('is-2');
		h.classList.add('has-text-centered');
		h.innerText = comic.title;
	output.appendChild(h);

	comic.sentences.sort((a, b) => {
		return a.order - b.order;
	}).forEach((pane, idx) => {

		console.log(pane);

		let tileClass = tileClasses[idx % tileClasses.length];

		let html = `
			<img class="is-grayscale" src="${pane.image}">
			<div class="comic-caption ${tileClass}">
				<p class="text">${pane.content}</p>
			</div>
			
		`;
		let div = document.createElement('div');
			div.classList.add('tile');
			div.classList.add('is-child');
			div.classList.add('pane');
		let tileSize = tileSizes[idx % tileSizes.length];
			div.classList.add(tileSize);
			div.innerHTML = html;

		if (idx % panesPerLine === 0) {
			if (parent) {
				output.appendChild(parent);
			}
			parent = document.createElement('div');
			parent.classList.add('tile');
			parent.classList.add('is-parent');
			parent.classList.add('pane-holder');
		}

		parent.appendChild(div);

	});

	output.appendChild(parent);

	let btnDiv = document.createElement('div');
		btnDiv.innerHTML = `
			<div class="field is-grouped is-grouped-centered">
				<p class="control">
					<button data-action="save" class="button is-info">Save Comic</button>
				</p>
				<p class="control">
					<a href="${comic.url}" target="blank_" class="button is-info is-outlined">View Article</a>
				</p>
			</div>
			<br>
		`;
	output.appendChild(btnDiv);

	return output;
}

let port = chrome.runtime.connect({name: "omni-popup"});
let output = document.getElementById('output');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	if (request.type === 'send_article') {
		request.article.images = true;
		let urlHash = getURLHash(request.article.url);
		db.ref(`newsreel/comics/${urlHash}`).once('value', (snap) => {
			let val = snap.val() || false;
			if (val) {
				let comic = val;
				comic.url = request.article.url;
				let div = renderComic(comic);
				output.innerHTML = '';
				output.appendChild(div);
				let btn = output.querySelector('[data-action="save"]')
					btn.addEventListener('click', (e) => {
						let cidx = parseInt(btn.dataset.comic, 10);
						let hash = getURLHash(comic.url);
						db.ref(`newsreel/comics/${hash}`).set(comic);
					});
			} else {
				getComicFromArticle(request.article).then((comic) => {
					console.log(comic);
					comic.url = request.article.url;
					let div = renderComic(comic);
					output.innerHTML = '';
					output.appendChild(div);
					let btn = output.querySelector('[data-action="save"]')
						btn.addEventListener('click', (e) => {
							let cidx = parseInt(btn.dataset.comic, 10);
							let hash = getURLHash(comic.url);
							db.ref(`newsreel/comics/${hash}`).set(comic);
						});
				}).catch((res) => {
					console.log(res);
					output.innerHTML = `<p class="title is-1">${res.error}</p>`;
				});
			}
		});
	}
});

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
	chrome.tabs.sendMessage(tabs[0].id, {
		type: 'get_article'
	}, (response) => {
		//console.log(response);
	});
});