import { send, send_receive } from "./send-rec";

export interface IAppApi {
	close: () => Promise<void>;
	minimize: () => Promise<void>;
	toggleMaximize: () => Promise<boolean>;
}

export class AppApi implements IAppApi {
	close = (): Promise<void> => {
		return send("app-close");
	};

	minimize = (): Promise<void> => {
		return send("app-min");
	};

	toggleMaximize = (): Promise<boolean> => {
		return send_receive("app-toggle-max");
	};
}
