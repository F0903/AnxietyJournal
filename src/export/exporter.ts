import { writeFile, utils } from "xlsx";
import { ExportFormat } from "../models/export-format";
import path from "path";

export async function exportToDirectory(
	rowsCols: unknown[][],
	dir: string,
	format: ExportFormat
): Promise<void> {
	const book = utils.book_new();
	const sheet = utils.aoa_to_sheet(rowsCols);
	utils.book_append_sheet(book, sheet, "Journal");
	writeFile(book, path.join(dir, `journal${format}`));
}
