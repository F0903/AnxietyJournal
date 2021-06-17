import { SetSidebarPage } from "../sidebar";
import { ExportFormat } from "../../models/exportformat";

let currentFormat: ExportFormat = ExportFormat.ods;
let dropdownIconContainer: HTMLElement;
let dropdownList: HTMLElement;

function GetSimplifiedFormatName(format: ExportFormat) {
	switch (format) {
		case ExportFormat.ods:
			return "OpenDocument (.ods)";
		case ExportFormat.xlsx:
			return "Excel (.xlsx)";

		default:
			throw new Error("Unknown format type.");
	}
}

export function GetFormat(): ExportFormat {
	return currentFormat;
}

export default function InitExport(): void {
	const xport = document.querySelector("#SidebarExport") as HTMLElement;
	xport.addEventListener("click", OnExportClick);

	const exportButton = document.querySelector(
		".exporter-button"
	) as HTMLElement;
	exportButton.addEventListener("click", OnExporterClick);

	dropdownList = document.querySelector(
		".exporter-format-changer-options-list"
	) as HTMLElement;
	const exportFormatOptions = dropdownList.querySelectorAll(
		".exporter-format-changer-option"
	);
	exportFormatOptions.forEach((x) =>
		x.addEventListener("click", (ev) =>
			OnDropdownSelect(ev.target as HTMLElement)
		)
	);

	const dropdown = document.querySelector(
		".exporter-format-changer-dropdown"
	) as HTMLElement;
	dropdown.addEventListener("click", OnDropdownClick);
	dropdownIconContainer = dropdown.querySelector(
		".exporter-format-changer-dropdown-icon-container"
	) as HTMLElement;

	UpdateDropdownValue();
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
		if (i === 0) return;
		if (!rowsCols[i]) rowsCols[i] = [];
		rowsCols[i] = [
			x.date.toLocaleDateString(),
			x.task,
			x.anxietyScale,
			x.optionalNote,
		];
	});
	await window.export.exportToUserSelection(rowsCols, currentFormat);
}

function OnDropdownClick() {
	ToggleDropdown();
}

function OnDropdownSelect(option: HTMLElement) {
	currentFormat = option.getAttribute("data-format") as ExportFormat;
	UpdateDropdownValue();
	ToggleDropdown();
}

function ToggleDropdown() {
	dropdownIconContainer.classList.toggle("rotate-half");
	dropdownList.classList.toggle("shown");
}

function UpdateDropdownValue() {
	const text = document.querySelector(
		".exporter-format-changer-dropdown-text"
	) as HTMLElement;
	text.innerText = GetSimplifiedFormatName(currentFormat);
}
