import { ExportFormat } from "../models/export-format";
import { send } from "./send-rec";

export interface IExportApi {
	exportToUserSelection: (
		rowCols: unknown[][],
		format: ExportFormat
	) => Promise<void>;
}

export class ExportApi implements IExportApi {
	exportToUserSelection = (
		rowCols: unknown[][],
		format: ExportFormat
	): Promise<void> => {
		return send("export-userselect", rowCols, format);
	};
}
