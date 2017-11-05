function sendMessage(data, callback){
	chrome.runtime.sendMessage(data, function(response){
		if(callback){
			callback(response);
		}
	});
}

let title = document.querySelector('h1').innerText;
let content = Array.from(document.querySelectorAll('p')).map(d => d.innerText).reduce((a, v) => a + v);
let article = {
	title: title,
	content: content
};
console.log(article);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	if (request.type === 'get_article') {
		sendMessage({
			type: 'send_article',
			article: article
		}, (e) => {
			console.log('done! sent it!')
		});
	}
});