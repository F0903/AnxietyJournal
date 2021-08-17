import { SummonFortune } from "./fortune";
import { InitSidebar } from "./sidebar/sidebar";
import "@fortawesome/fontawesome-free/js/all.min.js";

export const onSubmit: CallableFunction[] = [];

window.onload = () => {
	InitMain();
	InitSidebar();
	InitMisc();
};

function InitMain() {
	document.querySelectorAll<HTMLElement>(".input-box").forEach((x) => {
		x.innerText = x.getAttribute("placeholder") ?? "";
	});
	document
		.querySelectorAll<HTMLElement>(".field-box.input-box")
		.forEach((x) => {
			x.addEventListener("focus", (ev) => OnBoxFocus(ev.target as HTMLElement));
		});
	document
		.querySelectorAll<HTMLInputElement>("input.anxiety-slider")
		.forEach((x) => {
			x.addEventListener("input", (ev) =>
				OnSliderChange(ev.target as HTMLInputElement)
			);
		});
	document
		.querySelectorAll<HTMLElement>(".field-box.input-box")
		.forEach((x) => {
			x.addEventListener("blur", (ev) => OnBoxBlur(ev.target as HTMLElement));
		});

	const submit = document.querySelector(".submit-button") as HTMLElement;
	submit.addEventListener("click", OnSubmitClick);
	submit.classList.add("clickable");
}

function InitMisc() {
	document.querySelectorAll<HTMLLinkElement>("a.text-link").forEach((x) => {
		x.addEventListener("click", (ev) => OnLink(ev.target as HTMLLinkElement));
		x.classList.add("clickable");
	});
}

async function OnLink(elem: HTMLLinkElement) {
	const link = elem.getAttribute("data-link") as string;
	await window.link.link_open(link);
}

function OnBoxFocus(elem: HTMLElement) {
	if (elem.innerText !== elem.getAttribute("placeholder")) return;
	elem.innerText = "";
}

function OnBoxBlur(elem: HTMLElement) {
	if (elem.innerText !== "") return;
	elem.innerText = elem.getAttribute("placeholder") ?? "";
}

async function OnSubmitClick() {
	const submitButton = document.querySelector(
		"div.submit-button"
	) as HTMLElement;
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

	submitButton.classList.add("submit-animation");
	submitButton.onanimationend = () => {
		submitButton.classList.remove("submit-animation");
	};

	SummonFortune();

	onSubmit.forEach((fn) => fn());
}

function OnSliderChange(slider: HTMLInputElement) {
	const valShower = document.querySelector(
		"span.anxiety-slider-value"
	) as HTMLSpanElement;
	valShower.innerText = slider.value;
}
