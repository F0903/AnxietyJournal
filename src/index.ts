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
}
