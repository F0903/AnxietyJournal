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
