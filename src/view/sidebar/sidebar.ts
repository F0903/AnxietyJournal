import InitAbout from "../About/about";
import InitExport from "../Export/export";
import InitJournal from "../Journal/journal";

export function GetActiveSidebarPage(
	cachedContainer?: HTMLDivElement
): string | null {
	cachedContainer ??= document.querySelector(
		"div.sidebar-page-container"
	) as HTMLDivElement;
	return cachedContainer.getAttribute("data-active-page");
}

export function SetSidebarPage(pageName: string): boolean {
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

export function InitSidebar(): void {
	const sidebarButton = document.querySelector(
		".sidebar-button"
	) as HTMLElement;
	sidebarButton.addEventListener("click", OnSidebarButtonClick);

	InitJournal();
	InitExport();
	InitAbout();
}

function OnSidebarButtonClick() {
	const sidebar = document.querySelector("div.sidebar") as HTMLDivElement;
	sidebar.classList.toggle("shown");
}
