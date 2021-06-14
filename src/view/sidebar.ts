export async function UpdateJournalItems(): Promise<void> {
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
		SetTemplateClickEvent(item);
		item.setAttribute("data-id", element._id);
		title.textContent = element.task;
		difficulty.textContent = element.anxietyScale.toString();
		date.textContent = element.date.toLocaleDateString();
		note.textContent = element.optionalNote ?? "No extra note :)";
		insertionNode.append(itemFragment);
	});
}

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
	sidebarButton.classList.add("clickable");

	const journal = document.querySelector("#SidebarJournal") as HTMLElement;
	journal.addEventListener("click", OnJournalClick);
	journal.classList.add("clickable");

	const xport = document.querySelector("#SidebarExport") as HTMLElement;
	xport.addEventListener("click", OnExportClick);
	xport.classList.add("clickable");

	const about = document.querySelector("#SidebarAbout") as HTMLElement;
	about.addEventListener("click", OnAboutClick);
	about.classList.add("clickable");
}

function SetTemplateClickEvent(parent: HTMLElement) {
	const closer = parent.querySelector(".journal-item-close") as HTMLElement;
	closer.addEventListener("click", () => {
		OnJournalDelete(parent);
	});
	closer.classList.add("clickable");
}

function OnSidebarButtonClick() {
	const sidebar = document.querySelector("div.sidebar") as HTMLDivElement;
	if (!sidebar.classList.contains("shown")) sidebar.classList.add("shown");
	else sidebar.classList.remove("shown");
}

async function OnJournalClick() {
	if (SetSidebarPage("Journal")) await UpdateJournalItems();
}

async function OnJournalDelete(item: HTMLElement): Promise<void> {
	const id = item.getAttribute("data-id") as string;
	await window.db.delete("journal", { _id: id });
	item.remove();
}

function OnExportClick() {
	SetSidebarPage("Export");
}

function OnAboutClick() {
	SetSidebarPage("About");
}
