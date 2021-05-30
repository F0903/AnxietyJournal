// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnLoad() {
	document.querySelectorAll(".input-box").forEach((x) => {
		const elem = x as HTMLElement;
		elem.innerText = elem.getAttribute("placeholder") ?? "";
	});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBoxFocus(elem: HTMLElement) {
	if (elem.innerText != elem.getAttribute("placeholder")) return;
	elem.innerText = "";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBoxBlur(elem: HTMLElement) {
	if (elem.innerText != "") return;
	elem.innerText = elem.getAttribute("placeholder") ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBodyClick(body: HTMLElement, event: MouseEvent) {
	if (event.target != body) return;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnSubmitClick() {
	console.log("submit");
	const taskBox = document.querySelector("div.task-box") as HTMLElement;
	const task = taskBox.innerText;
	const scaleSlider = document.querySelector(
		"input.anxiety-slider"
	) as HTMLInputElement;
	const scale = parseInt(scaleSlider.value);
	const noteBox = document.querySelector("div.note-box") as HTMLElement;
	const note =
		noteBox.innerText != noteBox.getAttribute("placeholder")
			? noteBox.innerText
			: undefined;
	window.api.db_set("journal", {
		task: task,
		anxietyScale: scale,
		optionalNote: note,
	});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnSliderChange(slider: HTMLInputElement) {
	const valShower = document.querySelector(
		"span.anxiety-slider-value"
	) as HTMLSpanElement;
	valShower.innerText = slider.value;
}
