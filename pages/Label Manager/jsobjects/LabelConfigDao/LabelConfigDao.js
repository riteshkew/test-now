export default {
	check: () => {
		let newConfig = Fetch_Label_Config.data;
		if (!this.labelExists(Table1.selectedRow.name)) {
			newConfig = this.addLabelToConfig(Table1.selectedRow.name, edit_desc.text, edit_color.text, edit_pod.selectedOptionValue, edit_is_pod.isSwitchedOn)
		}
		console.log(newConfig);
		newConfig = this.moveLabelPod(newConfig);
		newConfig = this.renameConfigLabel(newConfig);
		newConfig.runners[0].issue.labels = Utils.sortPods(newConfig.runners[0].issue.labels);
		if (edit_is_pod.isSwitchedOn && !this.getPodLabels().includes(Table1.selectedRow.name)) {
			newConfig.runners[0].issue.labels[edit_name.text] = {
			  conditions: [],
			  requires: 1
			}
		}
		return newConfig;
	},
	getPodLabels: () => {
		return Object.keys(Fetch_Label_Config.data.runners[0].issue.labels);
	},
	getPodForLabel: (label) => {
		const config = Fetch_Label_Config.data;
		const runners = config.runners;
		const pods = this.getPodLabels();
		let foundPod;
		pods.map((podLabel) => {
			const foundLabel = runners[0].issue.labels[podLabel].conditions.find((condition) => {
				return condition.label === label && podLabel !== label
			})
			if (foundLabel) {
				foundPod = podLabel
			}
		});
		return foundPod;
	},
	removeLabelFromPods: (label, config = Fetch_Label_Config.data) => {
		const pods = this.getPodLabels();
		pods.map((podLabel) => {
			config.runners[0].issue.labels[podLabel].conditions = 
				config.runners[0].issue.labels[podLabel].conditions.filter((condition) => {
					return label === podLabel || condition.label !== label
				})
		});
		return config;
	},
	moveLabelPod: (config = Fetch_Label_Config.data) => {
		let cleanConfig = this.removeLabelFromPods(Table1.selectedRow.name, config);
		if (edit_pod.selectedOptionValue !== "None") {
			showAlert(edit_pod.selectedOptionValue);
			config.runners[0].issue.labels[edit_pod.selectedOptionValue].conditions.push({
					label: Table1.selectedRow.name,
					type: "hasLabel",
					value: true
				});
		}
		return config;
	},
	renameConfigLabel: (config = Fetch_Label_Config.data) => {
		const podLabels = this.getPodLabels();
		const changedLabel = Table1.selectedRow.name;
		let podLabelUpdated = podLabels.includes(changedLabel);
		podLabels.map((podLabel) => {
			const conditions = config.runners[0].issue.labels[podLabel].conditions;
			conditions.map((condition) => {
				if (condition.label === changedLabel) {
					condition.label = edit_name.text
				}
			})
		})
		if (podLabelUpdated) {
			config.runners[0].issue.labels[edit_name.text] = config.runners[0].issue.labels[changedLabel]
			if (edit_name.text !== changedLabel) {
				config.runners[0].issue.labels = _.omit(config.runners[0].issue.labels, changedLabel)
			}
		}
		if (edit_name.text !== changedLabel) {
				config.labels[edit_name.text] = config.labels[changedLabel];
				config.labels[edit_name.text].name = edit_name.text;
				config.labels = _.omit(config.labels, changedLabel);
		}
		config.labels[edit_name.text].description = edit_desc.text;
		config.labels[edit_name.text].color = color_input.text.substr(1);
		return config;
	},
	labelExists: (label) => {
		return Fetch_Label_Config.data.labels[label] !== undefined
	},
	updateLabel: () => {
			let newConfig = Fetch_Label_Config.data;
		  if (!this.labelExists(Table1.selectedRow.name)) {
				newConfig = this.addLabelToConfig(Table1.selectedRow.name, edit_desc.text, edit_color.text, edit_pod.selectedOptionValue, edit_is_pod.isSwitchedOn)
			}
			console.log(newConfig);
			newConfig = this.moveLabelPod(newConfig);
			newConfig = this.renameConfigLabel(newConfig);
			newConfig.runners[0].issue.labels = Utils.sortPods(newConfig.runners[0].issue.labels);
			if (edit_is_pod.isSwitchedOn && !this.getPodLabels().includes(Table1.selectedRow.name)) {
				newConfig.runners[0].issue.labels[edit_name.text] = {
					conditions: [],
					requires: 1
				}
			}
			Update_Label_Config.run(() => {
				Update_Label.run(() => LabelConfigDao.refreshPage())
			}, undefined, newConfig);
	},
	refreshPage: () => {
		Fetch_Labels.run(); 
		if (Table1.searchText.length > 0)
			search_labels.run(); 
		Fetch_Label_Config.run();
	},
	addLabelToConfig: (labelName, description, color, pod, isPod) => {
		let config = Fetch_Label_Config.data;
		config.labels[labelName] = {
			name: labelName,
			description: description,
			color: color.substr(1)
		}
		let runners = config.runners
		if (pod !== "None") {
			runners[0].issue.labels[pod].conditions.push({
				label: labelName,
				type: "hasLabel",
				value: true
			});
		}
		if (isPod) {
			runners[0].issue.labels[labelName] = {
				conditions: [],
				requires: 1
			}
		}
		return config;
	},
	create: () => {
		Create_Label1.run(() => {
			let config = this.addLabelToConfig(label_name.text, label_desc.text, color_input.text, pod_selector.selectedOptionValue, is_pod.isSwitchedOn);
			Update_Label_Config.run(() => {
				LabelConfigDao.refreshPage();
				resetWidget('Modal1', true);
				closeModal('Modal1');
				storeValue('rand', undefined);
			}, undefined, config);
		})
	},
	delete: () => {
		const config = this.removeLabelFromPods(Table1.selectedRow.name, Fetch_Label_Config.data);
		config.labels = _.omit(config.labels, Table1.selectedRow.name);
		Delete_Label.run((response, params) => {
			Update_Label_Config.run(() => this.refreshPage(), undefined, params);
		}, undefined, config);
	},
	checkIsPod: () => {
		return (Fetch_Label_Config.data.runners[0].issue.labels[Table1.selectedRow.name] !== undefined)
	},
	getLabelsForPod: () => {
		return Fetch_Label_Config.data.runners[0].issue.labels[filter_pod.selectedOptionValue].conditions.map((label) => Fetch_Label_Config.data.labels[label.label]).filter((label) => label !== undefined)
	}
}