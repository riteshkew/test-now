export default {
	labelOrder: {
		"Team Managers Pod": 1,
		"Actions Pod": 9,
		"Platform Pod": 8,
		"UI Building Pod": 10,
		"UI Builders Pod": 6,
		"App Viewers Pod": 5,
		"FE Coders Pod": 4,
		"BE Coders Pod": 3,
		"New Developers Pod": 2,
		"User Education Pod": 7
	},
	sortPods: (labels = Fetch_Label_Config.data.runners[0].issue.labels) => {
		const order = this.labelOrder;
		return Object.keys(labels).sort((a, b) => {
			const orderA = order[a];
			const orderB = order[b];
			return orderA < orderB ? -1 : 1;
		}).reduce((c, d) => (c[d] = labels[d], c), {});
	}
}