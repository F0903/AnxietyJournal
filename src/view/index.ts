// TOP FUNCTIONS ARE CALLED FROM HTML
//TODO: Fix the null body error with webpack.
console.log(window);
console.log(document);
console.log(document.body);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.document.body.onload = () => {
	console.log("body");
	document.querySelectorAll(".input-box").forEach((x) => {
		const elem = x as HTMLElement;
		elem.innerText = elem.getAttribute("placeholder") ?? "";
	});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OnLink(elem: HTMLElement) {
	const link = elem.getAttribute("data-link") as string;
	await window.link.link_open(link);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnSidebarButtonClick() {
	const sidebar = document.querySelector("div.sidebar") as HTMLDivElement;
	if (!sidebar.classList.contains("shown")) sidebar.classList.add("shown");
	else sidebar.classList.remove("shown");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OnJournalClick() {
	if (SetSidebarPage("Journal")) await UpdateJournalItems();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnExportClick() {
	SetSidebarPage("Export");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnAboutClick() {
	SetSidebarPage("About");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBoxFocus(elem: HTMLElement) {
	if (elem.innerText !== elem.getAttribute("placeholder")) return;
	elem.innerText = "";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBoxBlur(elem: HTMLElement) {
	if (elem.innerText !== "") return;
	elem.innerText = elem.getAttribute("placeholder") ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnBodyClick(body: HTMLElement, event: MouseEvent) {
	if (event.target !== body) return;
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

	await window.journal_db.set("journal", {
		task: task,
		anxietyScale: scale,
		date: new Date(),
		optionalNote: note,
	});

	if (GetActiveSidebarPage() === "Journal") await UpdateJournalItems();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OnSliderChange(slider: HTMLInputElement) {
	const valShower = document.querySelector(
		"span.anxiety-slider-value"
	) as HTMLSpanElement;
	valShower.innerText = slider.value;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function OnJournalDelete(item: HTMLDivElement) {
	const id = item.getAttribute("data-id") as string;
	await window.db.delete("journal", { _id: id });
	item.remove();
}

//TODO: Find a way to seperate Journal functions to their own seperate files.
async function UpdateJournalItems(): Promise<void> {
	const journal = await window.journal_db.get_all("journal", {});
	const insertionNode = document.querySelector(
		"div.journal-grid"
	) as HTMLDivElement;
	insertionNode.textContent = "";
	const template = document.querySelector(
		"template.journal-item-template"
	) as HTMLTemplateElement;
	journal.forEach((element) => {
		const itemFragment = template.content.cloneNode(true) as DocumentFragment;
		const item = itemFragment.firstChild?.nextSibling as HTMLDivElement;
		const title = item.querySelector(
			"h2.journal-item-title"
		) as HTMLHeadingElement;
		const difficulty = item.querySelector(
			"div.journal-item-difficulty"
		) as HTMLDivElement;
		const date = item.querySelector(
			"h4.journal-item-date"
		) as HTMLHeadingElement;
		const note = item.querySelector(
			"span.journal-item-note"
		) as HTMLSpanElement;
		item.setAttribute("data-id", element._id);
		title.textContent = element.task;
		difficulty.textContent = element.anxietyScale.toString();
		date.textContent = element.date.toLocaleDateString();
		note.textContent = element.optionalNote ?? "No extra note :)";
		insertionNode.append(itemFragment);
	});
}

function GetActiveSidebarPage(cachedContainer?: HTMLDivElement) {
	cachedContainer ??= document.querySelector(
		"div.sidebar-page-container"
	) as HTMLDivElement;
	return cachedContainer.getAttribute("data-active-page");
}

function SetSidebarPage(pageName: string) {
	const container = document.querySelector(
		"div.sidebar-page-container"
	) as HTMLDivElement;
	if (GetActiveSidebarPage(container) === pageName) return false;
	let pageFound = false;
	container.querySelectorAll("div.sidebar-page").forEach((elem) => {
		if (elem.id === pageName) {
			elem.classList.add("shown");
			pageFound = true;
			return;
		}
		elem.classList.remove("shown");
	});
	if (!pageFound) throw new Error(`Sidebar page "${pageName}" not found.`);
	container.setAttribute("data-active-page", pageName);
	return pageFound;
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
