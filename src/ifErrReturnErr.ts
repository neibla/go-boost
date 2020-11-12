import * as vscode from 'vscode';


function getIfErrWithDefaults(document: vscode.TextDocument, position: vscode.Position) {
    let funcPosition = position.translate(-1);
    while (funcPosition.line > 0 && !document.lineAt(funcPosition).text.startsWith('func')) {
        funcPosition = funcPosition.translate(-1);
    }
    const returnTypesEnd = document.lineAt(funcPosition).text.split(") (")[1];
    if (!returnTypesEnd) {
        return;
    }
    const returnTypes = returnTypesEnd.slice(0, returnTypesEnd.length - 3).split(", ");
    const defaults = [];
    function resolveDefaultValue(returnType: String) {
        if (returnType.startsWith("int")) {
            return 0;
        } else if (returnType.startsWith("float")) {
            return 0;
        } else if (returnType === "error") {
            return "err";
        } else if (returnType === "string") {
            return '""';
        } else if (returnType === "bool") {
            return "false";
        } else {
            return "nil";
        }
    }
    for (const returnTypeString of returnTypes) {
        const split = returnTypeString.split(" ");
        const returnType = split[split.length - 1];
        defaults.push(resolveDefaultValue(returnType));
    }
    return new vscode.CompletionItem(`if err != nil {\n\treturn ${defaults.join(", ")}\n}`);
}


const ifErrReturnErr = vscode.languages.registerCompletionItemProvider('go', {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

        const previousLine = position.translate(-1);
        const previousLineIncludesErr = document.lineAt(previousLine).text.includes("err");
        if (!previousLineIncludesErr) {
        	return;
        }

        const completionWithDefaults = getIfErrWithDefaults(document, previousLine);
        
        const completions = [];

        if (!!completionWithDefaults) {
            completionWithDefaults.preselect=true;
            completionWithDefaults.kind=vscode.CompletionItemKind.Method;
        	completions.push(completionWithDefaults);
        }

        const namedParamReturn = new vscode.CompletionItem('if err != nil {\n\treturn\n}');

        completions.push(namedParamReturn);

        return completions;
    }
},'\n', 'i');

export default ifErrReturnErr;