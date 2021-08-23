import { send } from "./send-rec";

export interface ILinkApi {
	open: (link: string) => Promise<void>;
}

export class LinkApi {
	open = (link: string): Promise<void> => {
		return send("link-open", link);
	};
}
