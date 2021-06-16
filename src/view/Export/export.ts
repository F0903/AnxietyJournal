import { SetSidebarPage } from "../sidebar";

export default function InitExport(): void {
	const xport = document.querySelector("#SidebarExport") as HTMLElement;
	xport.addEventListener("click", OnExportClick);
	const exportButton = document.querySelector(
		".exporter-button"
	) as HTMLElement;
	exportButton.addEventListener("click", OnExporterClick);
}

function OnExportClick() {
	SetSidebarPage("Export");
}

async function OnExporterClick() {
	const journal = await window.journal_db.get_all("journal", {});
	const len = journal.length;
	const propertyCount = 4;
	const rowsCols = new Array(len * propertyCount);
	rowsCols[0] = ["Date", "Task", "Difficulty", "Note"];
	journal.forEach((x, i) => {
		if (!rowsCols[i]) rowsCols[i] = [];
		rowsCols[i] = [
			x.date.toLocaleDateString(),
			x.task,
			x.anxietyScale,
			x.optionalNote,
		];
	});
	await window.export.exportToUserSelection(rowsCols);
}
