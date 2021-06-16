import { send } from "./send-rec";

export interface IExportApi {
	exportToUserSelection: (rowCols: unknown[][]) => Promise<void>;
}

export class ExportApi implements IExportApi {
	exportToUserSelection = (rowCols: unknown[][]): Promise<void> => {
		return send("export-userselect", rowCols);
	};
}
