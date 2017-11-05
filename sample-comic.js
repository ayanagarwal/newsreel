function getSampleComic() {
	let comic = {
		title: `Fake meat and free markets ease North Koreans’ hunger`,
		url: `http://www.reuters.com/investigates/special-report/northkorea-food/`,
		length: 10449,
		sentences: [
			{
				order: 0,
				index: 905,
				image: `https://www194.lunapic.com/do-not-link-here-use-hosting-instead/15098226634351?7931007645`,
				content: `The Soviet collapse in 1991 crippled the North Korean economy and brought down its centralised food distribution system.`
			},
			{
				order: 1,
				index: 2032,
				image: `https://www194.lunapic.com/editor/working/150981990085151?61168`,
				content: `The system consistently provides lower food rations than the government’s daily target, according to U.N. food agency the World Food Programme (WFP).`
			},
			{
				order: 2,
				index: 2823,
				image: `https://www194.lunapic.com/editor/working/15098203033609?63479`,
				content: `The WFP and the U.N.’s other main food aid agency, the Food and Agricultural Organisation, said the U.N. relies on all available information and inputs, including official statistics.`
			},
			{
				order: 3,
				index: 3370,
				image: `https://www194.lunapic.com/editor/working/150982019577639?88014`,
				content: `The agencies said they have seen no sign that more food than needed is delivered to North Koreans.`
			},
			{
				order: 4,
				index: 8776,
				image: `https://www194.lunapic.com/do-not-link-here-use-hosting-instead/150982040698770?9773525466`,
				content: `The country does not publish detailed import data but China’s exports of sugar to North Korea in January to September this year ballooned to 44,725 tonnes, Chinese data shows.`
			},
			{
				order: 5,
				index: 9332,
				image: `https://www194.lunapic.com/do-not-link-here-use-hosting-instead/150982048624135?74375616`,
				content: `At the other end of the social scale, Chinese data shows corn exports to North Korea also jumped in the first nine months of this year, to nearly 50,000 tonnes, compared with just over 3,000 tonnes in the whole of 2016.`
			}
		]
	}
	return new Promise((resolve, reject) => {
		resolve(comic);
	});
}

const ARTICLE_URL = "https://clever-garage.glitch.me/summarize";

function getComicByURL(params) {
	return new Promise((resolve, reject) => {
		$.get(ARTICLE_URL, params).then((res) => {
			console.log(res);
			resolve(res.data);
		}).catch(reject);
	});
}


