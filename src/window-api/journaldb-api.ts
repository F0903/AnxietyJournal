import { Filter } from "mongodb";
import { IJournalDocument, JournalDocument } from "../db/document";
import { send, send_receive } from "./send-rec";

export interface IJournalDbApi {
	get_all: <T>(
		colName: string,
		filterQuery: Filter<T>
	) => Promise<readonly JournalDocument[]>;

	set: (colName: string, value: IJournalDocument) => Promise<void>;
}

export class JournalDbApi implements IJournalDbApi {
	get_all = <T>(
		colName: string,
		filterQuery: Filter<T>
	): Promise<readonly JournalDocument[]> => {
		return send_receive("db-get-all", colName, filterQuery);
	};

	set = (colName: string, value: IJournalDocument): Promise<void> => {
		return send("db-set", colName, value);
	};
}
