export default {
	getMonthOptions: () => {
		let momentObj = moment().subtract(1, 'year');
		let i = 0;
		const options = [];
		for (i = 0; i < 12; i++) {
			momentObj.add(1, 'month');
			options.push({
				label: momentObj.format('MMMM'),
				value: momentObj.format('YYYY-MM')
			});
		}
		return options;
	},
	getMission: () => {
		if (appsmith.store.currentPod === "BE Coders Pod") {
			return "Our mission is to help developers easily query their data";
		} else if (appsmith.store.currentPod === "FE Coders Pod") {
			return "Our mission is to help developers easily code their business logic";
		} else if (appsmith.store.currentPod === "New Developers Pod") {
			return "Our mission is to help developers learn the core concepts in under 30 minutes";
		} else if (appsmith.store.currentPod === "App Viewers Pod") {
			return "Our mission is to ensure that developers are able to find and use every widget they need";
		} else if (appsmith.store.currentPod === "UI Builders Pod") {
			return "Our mission is to ensure that developers are able to build UI that delivers an excellent UX";
		} else if (appsmith.store.currentPod === "Team Managers Pod") {
			return "Our mission is to help large teams securely adopt the apps they build";
		}
	},
	getPlatform: (link) => {
		const github = /github/
		const intercom = /intercom/
		const discord = /discord/
		const forum = /community\.appsmith/
		if(link.search(github) > -1) return 'GITHUB';
		if(link.search(intercom) > -1) return 'INTERCOM';
		if(link.search(discord) > -1) return 'DISCORD';
		if(link.search(forum) > -1) return 'APPSMITH_FORUM';
		return 'OTHERS'
	},
	platforms: {
		INTERCOM: 'https://cdn.worldvectorlogo.com/logos/intercom-2.svg',
		DISCORD: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg',
		GITHUB: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg',
		APPSMITH_FORUM: 'https://i.ibb.co/7jhmdvh/Group-8554.png',
		OTHERS: 'https://cdn.worldvectorlogo.com/logos/roadrunner.svg'
	},
	isQualityMonthSelected: () => {
		return CriticalQualityChart.selectedDataPoint !== undefined || HighQualityChart.selectedDataPoint !== undefined
	}
}