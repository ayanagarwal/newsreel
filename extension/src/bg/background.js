chrome.runtime.onConnect.addListener((port) => {
	
	console.log('connect');

	port.onDisconnect.addListener((port) => {
		console.log('disconnect');
	});

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
});