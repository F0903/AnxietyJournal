import { SetSidebarPage } from "../sidebar/sidebar";
import { onSubmit } from "../index";

export default function InitJournal(): void {
	const journal = document.querySelector("#SidebarJournal") as HTMLElement;
	journal.addEventListener("click", OnJournalClick);
	onSubmit.push(UpdateJournalItems);
}

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

		SetTemplateClickEvent(item);

		item.setAttribute("data-id", element._id.toHexString());
		title.textContent = element.task;
		difficulty.textContent = element.anxietyScale.toString();
		date.textContent = element.date.toLocaleDateString();
		note.textContent = element.optionalNote ?? "No extra note :)";
		insertionNode.append(itemFragment);
	});
}

async function OnJournalClick() {
	if (SetSidebarPage("Journal")) await UpdateJournalItems();
}

async function OnJournalDelete(item: HTMLElement): Promise<void> {
	const id = item.getAttribute("data-id") as string;
	await window.db.delete("journal", { _id: id });
	item.remove();
}

function SetTemplateClickEvent(parent: HTMLElement) {
	const closer = parent.querySelector(".journal-item-close") as HTMLElement;
	closer.addEventListener("click", () => {
		OnJournalDelete(parent);
	});
	closer.classList.add("clickable");
}
