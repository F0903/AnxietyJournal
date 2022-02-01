import { Filter } from "mongodb";
import { IDbDocument } from "../db/document";
import { send, send_receive } from "./send-rec";

export interface IDbApi {
	get: <T>(
		colName: string,
		filterQuery: Filter<T>
	) => Promise<IDbDocument | null>;
	get_all: <T>(
		colName: string,
		filterQuery: Filter<T>
	) => Promise<readonly IDbDocument[]>;
	set: (colName: string, value: IDbDocument) => Promise<void>;
	delete: <T>(colName: string, query: Filter<T>) => Promise<void>;
}

export class DbApi implements IDbApi {
	get = async <T>(
		colName: string,
		filterQuery: Filter<T>
	): Promise<IDbDocument | null> => {
		return send_receive("db-get", colName, filterQuery);
	};

	get_all = async <T>(
		colName: string,
		filterQuery: Filter<T>
	): Promise<readonly IDbDocument[]> => {
		return send_receive("db-get-all", colName, filterQuery);
	};

	set = async (colName: string, value: IDbDocument): Promise<void> => {
		return send("db-set", colName, value);
	};

	delete = async <T>(
		colName: string,
		filterQuery: Filter<T>
	): Promise<void> => {
		return send("db-delete", colName, filterQuery);
	};
}
