// TOP FUNCTIONS ARE CALLED FROM HTML

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnLoad() {
	document.querySelectorAll(".input-box").forEach((x) => {
		const elem = x as HTMLElement;
		elem.innerText = elem.getAttribute("placeholder") ?? "";
	});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnSidebarButtonClick() {
	const sidebar = document.querySelector("div.sidebar") as HTMLDivElement;
	if (!sidebar.classList.contains("shown")) sidebar.classList.add("shown");
	else sidebar.classList.remove("shown");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OnJournalClick() {
	SetSidebarPage("./Journal/journal.html", "Journal");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OnExportClick() {
	SetSidebarPage("./Export/export.html", "Export");
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
async function OnSubmitClick() {
	const submitButton = document.querySelector(
		"div.submit-button"
	) as HTMLElement;
	submitButton.classList.add("submit-animation");
	submitButton.onanimationend = () =>
		submitButton.classList.remove("submit-animation");
	SummonFortune();
	return;

	const taskBox = document.querySelector("div.task-box") as HTMLElement;
	const task = taskBox.innerText;
	if (task === taskBox.getAttribute("placeholder")) return;
	const scaleSlider = document.querySelector(
		"input.anxiety-slider"
	) as HTMLInputElement;
	const scale = parseInt(scaleSlider.value);
	const noteBox = document.querySelector("div.note-box") as HTMLElement;
	const note =
		noteBox.innerText !== noteBox.getAttribute("placeholder")
			? noteBox.innerText
			: undefined;
	await window.api.db_set("journal", {
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

function SetSidebarPage(path: string, pageName: string) {
	const frame = document.querySelector(
		"iframe.sidebar-page"
	) as HTMLIFrameElement;
	if (frame.getAttribute("data-src") === pageName) return;
	frame.setAttribute("src", path);
	frame.setAttribute("data-src", pageName);
}

const fortuneArray = [
	"Even though a battle has been lost, the war is not yet over :)",
	"You've done your best, and that is all one can ask :)",
];

export function SummonFortune(fortuneCookie?: HTMLDivElement): void {
	fortuneCookie ??= document.querySelector(
		"div.fortune-cookie"
	) as HTMLDivElement;
	if (fortuneCookie.classList.contains("shown")) return;
	const text = fortuneCookie.querySelector(
		"span.fortune-cookie-text"
	) as HTMLSpanElement;
	text.innerText =
		fortuneArray[Math.floor(Math.random() * fortuneArray.length)];
	fortuneCookie.classList.add("shown");
	DecayFortune(fortuneCookie);
}

export function DecayFortune(fortuneCookie?: HTMLDivElement): void {
	fortuneCookie ??= document.querySelector(
		"div.fortune-cookie"
	) as HTMLDivElement;
	setTimeout(() => HideFortune(fortuneCookie), 5000);
}

export function HideFortune(fortuneCookie?: HTMLDivElement): void {
	fortuneCookie ??= document.querySelector(
		"div.fortune-cookie"
	) as HTMLDivElement;
	fortuneCookie.classList.remove("shown");
}
