import * as vscode from 'vscode';
import ifErrReturnErr from "./ifErrReturnErr";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(ifErrReturnErr);

}

// this method is called when your extension is deactivated
export function deactivate() {}


