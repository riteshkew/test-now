export default {
	fetchIssueStats: () => {
		fetch_low_issues.run();
		
		fetch_closed_high_issues.run();
		fetch_closed_high_issue_age.run();
		fetch_created_high_issues.run();
		fetch_open_high_issue_age.run();
		fetch_open_high_issues.run();

		fetch_closed_critical_issues.run();
		fetch_closed_crit_issue_age.run();
		fetch_created_critical_issues.run();
		fetch_open_crit_issue_age.run();
		fetch_open_crit_issues.run();
		
		fetch_closed_epic_issues.run();
		fetch_created_epic_issues.run();
		fetch_open_epic_issue_age.run();
		fetch_closed_epic_issue_age.run();
		fetch_open_epic_issues.run();
	},
	fetchWeeklyStats: async () => {
		const appViewerPromise = fetch_issue_close_rate.run({ pod: "App Viewers Pod" });
		const uiBuilderPromise = fetch_issue_close_rate.run({ pod: "UI Builders Pod" });
		const newDeveloperPromise = fetch_issue_close_rate.run({ pod: "New Developers Pod" });
		const teamManagerPromise = fetch_issue_close_rate.run({ pod: "Team Managers Pod" });
		const beCoderPromise = fetch_issue_close_rate.run({ pod: "BE Coders Pod" });
		const feCoderPromise = fetch_issue_close_rate.run({ pod: "FE Coders Pod" });
		
		const appViewerOpenPromise = fetch_issue_open_rate.run({ pod: "App Viewers Pod" });
		const uiBuilderOpenPromise = fetch_issue_open_rate.run({ pod: "UI Builders Pod" });
		const newDeveloperOpenPromise = fetch_issue_open_rate.run({ pod: "New Developers Pod" });
		const teamManagerOpenPromise = fetch_issue_open_rate.run({ pod: "Team Managers Pod" });
		const beCoderOpenPromise = fetch_issue_open_rate.run({ pod: "BE Coders Pod" });
		const feCoderOpenPromise = fetch_issue_open_rate.run({ pod: "FE Coders Pod" });
		return Promise.all([
			appViewerPromise, appViewerOpenPromise, uiBuilderPromise, uiBuilderOpenPromise, newDeveloperPromise, newDeveloperOpenPromise, teamManagerPromise, teamManagerOpenPromise, beCoderPromise, beCoderOpenPromise, feCoderPromise,
			feCoderOpenPromise
		 ]).
			then((res) => {
				const map = {};
				const podMap = {
					0: "app_viewers",
					1: "app_viewers",
					2: "ui_builders",
					3: "ui_builders",
					4: "new_developers",
					5: "new_developers",
					6: "team_managers",
					7: "team_managers",
					8: "be_coders",
					9: "be_coders",
					10: "fe_coders",
					11: "fe_coders",
				};
				res.map((stats, index) => {
					const podName = podMap[index];
					if (!map[podName])
						map[podName] = [];
					map[podName].push(stats.map((stat) => { return { x: index % 2 == 0 ? "closed" : "opened", y: stat.count } })[0]);
				});
				storeValue('stats', map, false);
				showModal('Modal1');
				return map;
		});
	}
}