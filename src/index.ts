document.onload = () => {
	document.querySelectorAll(".input-box").forEach((x) => {
		const elem = x as HTMLElement;
		elem.innerText = elem.getAttribute("placeholder") ?? "";
	});
};

function OnBoxClick(elem: HTMLDivElement) {
	elem.innerText = "";
}

function OnBodyClick(body: HTMLElement, event: MouseEvent) {
	if (event.target != body) return;
}
