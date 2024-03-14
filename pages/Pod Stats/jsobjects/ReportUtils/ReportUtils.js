export default {
	blacklistLabels: ["Bug", "Enhancement", "High", "Critical", "Low", "Documentation"],
	fetchQualityData: async () => {
		fetch_closed_critical_issues.run();
		fetch_closed_high_issues.run();
		fetch_created_critical_issues.run();
		fetch_created_high_issues.run();
		fetch_top_RICE_issues.run();
		fetch_closed_RICE_issues.run();
	},
	convertArrayToChartGroup: (arr) => {
		const dataArr = [];
		arr.map((data) => {
			if (dataArr.length == 0 || dataArr[dataArr.length - 1].x != data.month)
				dataArr.push({ x: data.month, y: 1 });
			else dataArr[dataArr.length - 1].y += 1;
		});
		return dataArr;
	},
	convertCommunityIssuesToChartGroup: () => {
		const countMap = {};
		fetch_community_queries.data.map((query) => {
			const labels = query.labels.filter((label) => {
				return !this.blacklistLabels.includes(label) && !label.includes('Pod');
			});
			labels.map((label) => {
				const obj = countMap[label];
				if (obj) {
					obj.y += 1;
				} else {
					countMap[label] = {
						x: label,
						y: 1
					}
				}
			});
		});
		return Object.values(countMap);
	},
	getIssuesForMonth: () => {
		let map = [];
		if (appsmith.store.selectedIssueMonth?.severity === "High") {
			 map = { created: fetch_created_high_issues.data, closed: fetch_closed_high_issues.data };
		} else {
			map = { created: fetch_created_critical_issues.data, closed: fetch_closed_critical_issues.data };
		}
		map.created = map.created.filter((data) => {
			return data.month === (appsmith.store.selectedIssueMonth?.month || Configs.getMonthOptions()[0].label)
    });
		map.closed = map.closed.filter((data) => {
			return data.month === (appsmith.store.selectedIssueMonth?.month || Configs.getMonthOptions()[0].label)
    });
		return map;
	},
	getCommunityQueriesCount: () => {
		return fetch_community_queries_count.data.map((row) => {
			return {
				x: row.label,
				y: row.count
			}
		}).filter((point) => {
			return !this.blacklistLabels.includes(point.x) && !point.x.includes('Pod');
		}).slice(0, 15);
	},
	changePod: async (pod) => {
		await storeValue('currentPod', pod);
		this.fetchQualityData();
		fetch_community_queries_count.run();
		fetch_feature_requests.run();
	},
	getUpvotesForSelectedIssue: () => {
		const upvotes = fetch_community_upvotes.data;
		const votesList = upvotes.map(item => {
			const { link, comment, author, created_at, comm_status, id } = item;
			return {
				id,
				platform: Configs.platforms[Configs.getPlatform(link)],
				link,
				comment,
				author: author.split('@')[0],
				created_at: moment(created_at).format('Do MMM'),
				comm_status
			};
		})
		return votesList;
	},
	initialise: async () => {
		if (appsmith.store.currentPod === undefined)
			await storeValue('currentPod', "App Viewers Pod");
		await this.fetchQualityData();
	},
	getRiceIssues: () => {
		return rice_filter.selectedOptionValue === "open" ? fetch_top_RICE_issues.data : fetch_closed_RICE_issues.data
	},
	testFunction1: async () => {
		await copyToClipboard(JSON.stringify(successfulQueryExecutionFunnel.data));
	}
}