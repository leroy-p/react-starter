// @ts-check

/** @type {typeof import('vscode')} */
const vscode = require('vscode')
const { formatText } = require('./spacing.js')

/*
 * Extension registration
 */

const ACTION_KIND = vscode.CodeActionKind.SourceFixAll.append('skelCodeActions')
const SUPPORTED_LANGUAGE_IDS = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']

/**
 * @param {import('vscode').ExtensionContext} context
 * @returns {void}
 */
function activate(context) {
  const selector = SUPPORTED_LANGUAGE_IDS.map((language) => ({ language, scheme: 'file' }))
  /** @type {import('vscode').CodeActionProvider} */
  const provider = {
    provideCodeActions(document, _range, codeActionContext) {
      if (!shouldProvideCodeAction(codeActionContext)) return []

      const text = document.getText()
      const formatted = formatText(document.fileName, text, document.languageId)
      if (formatted === text) return []

      const action = new vscode.CodeAction('Apply Skel spacing', ACTION_KIND)
      action.edit = createFullDocumentEdit(document, formatted)
      action.isPreferred = true

      return [action]
    },
  }

  context.subscriptions.push(vscode.languages.registerCodeActionsProvider(selector, provider, { providedCodeActionKinds: [ACTION_KIND] }))
  context.subscriptions.push(vscode.commands.registerTextEditorCommand('skelCodeActions.fixDocument', (editor) => applySpacingToEditor(editor)))
}

/*
 * Code action plumbing
 */

/**
 * @param {import('vscode').CodeActionContext} context
 * @returns {boolean}
 */
function shouldProvideCodeAction(context) {
  if (!context.only) return true

  return context.only.contains(ACTION_KIND) || ACTION_KIND.contains(context.only)
}

/**
 * @param {import('vscode').TextDocument} document
 * @param {string} formatted
 * @returns {import('vscode').WorkspaceEdit}
 */
function createFullDocumentEdit(document, formatted) {
  const edit = new vscode.WorkspaceEdit()
  const lastLine = document.lineAt(document.lineCount - 1)
  const fullRange = new vscode.Range(new vscode.Position(0, 0), lastLine.rangeIncludingLineBreak.end)

  edit.replace(document.uri, fullRange, formatted)

  return edit
}

/**
 * @param {import('vscode').TextEditor} editor
 * @returns {Promise<void>}
 */
async function applySpacingToEditor(editor) {
  const document = editor.document
  const text = document.getText()
  const formatted = formatText(document.fileName, text, document.languageId)
  if (formatted === text) return

  await vscode.workspace.applyEdit(createFullDocumentEdit(document, formatted))
}

module.exports = { activate }
