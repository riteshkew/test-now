export default {
	getSuccessfulQueryTrend: () => {
		const months = Object.keys(successfulQueryExecutionFunnel.data.data).sort();
		const importantPluginSeries= {
			"$overall": [], 
			"PostgreSQL": [], 
			"MongoDB": [], 
			"MySQL": [], 
			"REST API": [], 
			"Google Sheets": []
		};
		console.log("monthData");
		const pluginKeys = Object.keys(importantPluginSeries);
		months.map((month) => {
			const monthData = successfulQueryExecutionFunnel.data.data[month];
			const readableMonth = moment(month).format("MMM");
			pluginKeys.map((plugin) => {
				if (monthData[plugin]) {
					const convRatio = monthData[plugin][3].step_conv_ratio * monthData[plugin][2].step_conv_ratio;
					importantPluginSeries[plugin].push({
						x: readableMonth,
						y: Math.round(convRatio * 100)
					})
				}
			});
		});
		return importantPluginSeries;
	},
	getActivationData: () => {
		const months = Object.keys(successfulActivationFunnel.data.data).sort();
		const data = [];
		months.map((month) => {
			const monthData = successfulActivationFunnel.data.data[month];
			const readableMonth = moment(month).format("MMM");
			const convRatio = monthData.steps[3].overall_conv_ratio;
			data.push({
					x: readableMonth,
					y: Math.round(convRatio * 100)
			});
		});
		return data;
	},
	getBuildingData: () => {
		const months = Object.keys(successfulBuildingFunnel.data.data).sort();
		const data = [];
		months.map((month) => {
			const monthData = successfulBuildingFunnel.data.data[month];
			const readableMonth = moment(month).format("MMM");
			const convRatio = monthData.steps[4].step_conv_ratio;
			data.push({
					x: readableMonth,
					y: Math.round(convRatio * 100)
			});
		});
		return data;
	}
}