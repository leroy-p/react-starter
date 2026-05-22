// @ts-check

const { readdir, readFile, stat, writeFile } = require('node:fs/promises')
const path = require('node:path')
const process = require('node:process')

/**
 * Resolve TypeScript from common workspace locations.
 * This repo keeps TypeScript in the app workspace, not at monorepo root.
 *
 * @returns {typeof import('typescript')}
 */
function loadTypeScript() {
  /** @type {string[]} */
  const resolvePaths = [
    process.cwd(),
    path.join(process.cwd(), 'packages/react-app'),
    __dirname,
    path.resolve(__dirname, '..', '..', '..'),
    path.resolve(__dirname, '..', '..', '..', 'packages/react-app'),
  ]

  try {
    const modulePath = require.resolve('typescript', { paths: resolvePaths })

    return require(modulePath)
  } catch (error) {
    throw new Error(
      [
        'Unable to resolve the "typescript" module for skel-code-actions.',
        'Run npm install in the workspace and ensure TypeScript is installed.',
      ].join(' '),
      { cause: error instanceof Error ? error : undefined },
    )
  }
}

/** @type {typeof import('typescript')} */
const ts = loadTypeScript()

/**
 * @typedef {import('typescript').ClassElement} ClassElement
 * @typedef {import('typescript').Node} TsNode
 * @typedef {import('typescript').SourceFile} SourceFile
 * @typedef {import('typescript').Statement} Statement
 */

/*
 * CLI configuration
 */

const CHECK_FLAG = '--check'
const DEFAULT_ROOTS = ['src', '.vscode/extensions/skel-code-actions']
const IGNORED_DIRECTORIES = new Set(['.git', 'dist', 'node_modules'])
const SUPPORTED_EXTENSIONS = new Set(['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx'])

/*
 * File discovery
 */

/**
 * @param {string} filePath
 * @param {string | undefined} languageId
 * @returns {import('typescript').ScriptKind}
 */
function getScriptKind(filePath, languageId) {
  if (languageId === 'typescriptreact' || filePath.endsWith('.tsx')) return ts.ScriptKind.TSX
  if (languageId === 'javascriptreact' || filePath.endsWith('.jsx')) return ts.ScriptKind.JSX
  if (languageId === 'javascript' || filePath.endsWith('.js') || filePath.endsWith('.mjs') || filePath.endsWith('.cjs')) return ts.ScriptKind.JS

  return ts.ScriptKind.TS
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isSupportedFile(filePath) {
  if (filePath.endsWith('.d.ts')) return false

  return SUPPORTED_EXTENSIONS.has(path.extname(filePath))
}

/**
 * @param {string} inputPath
 * @returns {Promise<string[]>}
 */
async function collectCodeFiles(inputPath) {
  const fileStat = await stat(inputPath)
  if (fileStat.isFile()) return isSupportedFile(inputPath) ? [inputPath] : []
  if (!fileStat.isDirectory()) return []

  const entries = await readdir(inputPath, { withFileTypes: true })
  /** @type {string[]} */
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue

    const entryPath = path.join(inputPath, entry.name)
    files.push(...(await collectCodeFiles(entryPath)))
  }

  return files
}

/*
 * Source positions
 */

/**
 * @param {SourceFile} sourceFile
 * @param {number} position
 * @returns {number}
 */
function getLine(sourceFile, position) {
  return ts.getLineAndCharacterOfPosition(sourceFile, position).line
}

/**
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {number} position
 * @returns {number}
 */
function getLineStart(sourceFile, lineStarts, position) {
  return lineStarts[getLine(sourceFile, position)] ?? 0
}

/**
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {number} position
 * @returns {boolean}
 */
function startsOnOwnLine(text, sourceFile, lineStarts, position) {
  const lineStart = getLineStart(sourceFile, lineStarts, position)

  return text.slice(lineStart, position).trim() === ''
}

/**
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {TsNode} node
 * @param {number} previousEnd
 * @returns {number}
 */
function getStartLineIncludingLeadingComments(text, sourceFile, lineStarts, node, previousEnd) {
  const nodeStart = node.getStart(sourceFile)
  const comments = ts.getLeadingCommentRanges(text, node.pos) ?? []

  for (const comment of comments) {
    if (comment.pos < previousEnd) continue
    if (!startsOnOwnLine(text, sourceFile, lineStarts, comment.pos)) continue

    return getLineStart(sourceFile, lineStarts, comment.pos)
  }

  return getLineStart(sourceFile, lineStarts, nodeStart)
}

/**
 * @param {SourceFile} sourceFile
 * @param {number} previousEnd
 * @param {number} nextStartLine
 * @returns {boolean}
 */
function hasBlankLineBetween(sourceFile, previousEnd, nextStartLine) {
  return getLine(sourceFile, nextStartLine) - getLine(sourceFile, previousEnd) > 1
}

/*
 * AST spacing rules
 */

/**
 * @param {TsNode} node
 * @returns {boolean}
 */
function isFunctionLikeExpression(node) {
  return ts.isArrowFunction(node) || ts.isFunctionExpression(node)
}

/**
 * @param {Statement} statement
 * @returns {boolean}
 */
function isFunctionLikeStatement(statement) {
  if (ts.isFunctionDeclaration(statement)) return true
  if (!ts.isVariableStatement(statement)) return false

  return statement.declarationList.declarations.some((declaration) => typeof declaration.initializer !== 'undefined' && isFunctionLikeExpression(declaration.initializer))
}

/**
 * @param {ClassElement} member
 * @returns {boolean}
 */
function isFunctionLikeClassMember(member) {
  return ts.isConstructorDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isMethodDeclaration(member) || ts.isSetAccessorDeclaration(member)
}

/**
 * @param {string} value
 * @returns {number}
 */
function countOpeningBraces(value) {
  return (value.match(/{/g) ?? []).length
}

/**
 * @param {string} value
 * @returns {number}
 */
function countClosingBraces(value) {
  return (value.match(/}/g) ?? []).length
}

/**
 * @param {string} value
 * @returns {string | null}
 */
function getCssPropertyName(value) {
  const match = value.match(/^([a-zA-Z-][\w-]*)\s*:/)
  if (match?.[1]) return match[1].toLowerCase()

  return null
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isCssDeclarationLine(value) {
  if (!value.endsWith(';')) return false
  if (value.startsWith('@') || value.startsWith('&')) return false
  if (value.includes('{') || value.includes('}')) return false

  return getCssPropertyName(value) !== null
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeCssDeclarationLine(value) {
  const match = value.match(/^([a-zA-Z-][\w-]*)\s*:\s*(.*?)\s*;\s*$/)
  if (!match) return value
  const property = match[1]
  const cssValue = match[2]

  return `${property}: ${cssValue};`
}

/**
 * @param {string[]} lines
 * @returns {string[]}
 */
function sortCssDeclarationRuns(lines) {
  /** @type {string[]} */
  const next = []

  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (typeof line === 'undefined') break
    const trimmed = line.trim()
    if (!isCssDeclarationLine(trimmed)) {
      next.push(line)
      index++

      continue
    }

    const runStart = index
    while (index < lines.length && isCssDeclarationLine((lines[index] ?? '').trim())) {
      index++
    }

    const declarations = lines.slice(runStart, index)
    declarations.sort((left, right) => {
      const leftName = getCssPropertyName(left.trim()) ?? ''
      const rightName = getCssPropertyName(right.trim()) ?? ''
      if (leftName === rightName) return left.localeCompare(right)

      return leftName.localeCompare(rightName)
    })
    next.push(...declarations)
  }

  return next
}

/**
 * @param {string} segmentText
 * @returns {string}
 */
function formatCssSegment(segmentText) {
  const hadLeadingNewline = segmentText.startsWith('\n')
  const hadTrailingNewline = segmentText.endsWith('\n')
  const normalized = segmentText.replace(/\r\n/g, '\n')
  const rawLines = normalized.split('\n')

  // Trim blank edges to avoid introducing indentation drift around template delimiters.
  while (rawLines.length > 0 && (rawLines[0] ?? '').trim() === '') rawLines.shift()
  while (rawLines.length > 0 && (rawLines[rawLines.length - 1] ?? '').trim() === '') rawLines.pop()
  if (rawLines.length === 0) return segmentText

  /** @type {string[]} */
  const reindented = []
  const baseIndentLevel = 1
  let depth = 0

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim()
    if (trimmed === '') {
      reindented.push('')

      continue
    }

    if (trimmed.startsWith('}')) depth = Math.max(0, depth - 1)
    const normalized = isCssDeclarationLine(trimmed) ? normalizeCssDeclarationLine(trimmed) : trimmed
    reindented.push(`${' '.repeat((depth + baseIndentLevel) * 2)}${normalized}`)
    const netDepth = countOpeningBraces(trimmed) - countClosingBraces(trimmed)
    depth = Math.max(0, depth + netDepth)
  }

  const sorted = sortCssDeclarationRuns(reindented)
  let result = sorted.join('\n')
  if (hadLeadingNewline) result = `\n${result}`
  if (hadTrailingNewline) result = `${result}\n`

  return result
}

/**
 * @param {ts.TaggedTemplateExpression} node
 * @returns {boolean}
 */
function isStyledTemplateTag(node) {
  const tagText = node.tag.getText()

  return tagText.startsWith('styled.') || tagText.startsWith('styled(')
}

/**
 * @param {ReadonlyArray<{ start: number, end: number, text: string }>} edits
 * @param {string} text
 * @param {number} start
 * @param {number} end
 * @returns {void}
 */
function maybeAddCssEdit(edits, text, start, end) {
  if (start >= end) return

  const current = text.slice(start, end)
  const formatted = formatCssSegment(current)
  if (formatted === current) return

  edits.push({ start, end, text: formatted })
}

/**
 * Normalizes declaration lines that use a single interpolation value:
 * `prop:${...}  ;` -> `prop: ${...};`
 *
 * @param {string} templateCss
 * @returns {string}
 */
function normalizeInterpolatedDeclarationSpacing(templateCss) {
  const normalizedLines = templateCss.split('\n').map((line) => {
    const withSpaceAfterColon = line.replace(/^(\s*[a-zA-Z-][\w-]*)\s*:\s*\$\{/, '$1: ${')

    return withSpaceAfterColon.replace(/\}\s*;\s*$/, '};')
  })

  return normalizedLines.join('\n')
}

/**
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @returns {string}
 */
function formatStyledComponentsCss(text, sourceFile) {
  /** @type {Array<{ start: number, end: number, text: string }>} */
  const edits = []

  /**
   * @param {TsNode} node
   * @returns {void}
   */
  function visit(node) {
    if (ts.isTaggedTemplateExpression(node) && isStyledTemplateTag(node)) {
      const templateStart = node.template.getStart(sourceFile) + 1
      const templateEnd = node.template.getEnd() - 1
      maybeAddCssEdit(edits, text, templateStart, templateEnd)

      if (ts.isNoSubstitutionTemplateLiteral(node.template)) {
        // handled by whole-template pass above
      } else if (ts.isTemplateExpression(node.template)) {
        const head = node.template.head
        maybeAddCssEdit(edits, text, head.getStart(sourceFile) + 1, head.getEnd() - 2)

        for (const span of node.template.templateSpans) {
          const literal = span.literal
          if (ts.isTemplateMiddle(literal)) {
            maybeAddCssEdit(edits, text, literal.getStart(sourceFile) + 1, literal.getEnd() - 2)
          } else {
            maybeAddCssEdit(edits, text, literal.getStart(sourceFile) + 1, literal.getEnd() - 1)
          }
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  if (edits.length === 0) return text

  let formatted = text
  for (const edit of edits.sort((left, right) => right.start - left.start)) {
    formatted = `${formatted.slice(0, edit.start)}${edit.text}${formatted.slice(edit.end)}`
  }

  // Second pass on styled template content to normalize `prop: ${...};` spacing.
  const refreshedSourceFile = ts.createSourceFile(sourceFile.fileName, formatted, ts.ScriptTarget.Latest, true, sourceFile.scriptKind)
  /** @type {Array<{ start: number, end: number, text: string }>} */
  const spacingEdits = []

  /**
   * @param {TsNode} node
   * @returns {void}
   */
  function visitForSpacing(node) {
    if (ts.isTaggedTemplateExpression(node) && isStyledTemplateTag(node)) {
      const start = node.template.getStart(refreshedSourceFile) + 1
      const end = node.template.getEnd() - 1
      const current = formatted.slice(start, end)
      const normalized = normalizeInterpolatedDeclarationSpacing(current)
      if (normalized !== current) spacingEdits.push({ start, end, text: normalized })
    }

    ts.forEachChild(node, visitForSpacing)
  }

  visitForSpacing(refreshedSourceFile)
  if (spacingEdits.length === 0) return formatted

  let spacingFormatted = formatted
  for (const edit of spacingEdits.sort((left, right) => right.start - left.start)) {
    spacingFormatted = `${spacingFormatted.slice(0, edit.start)}${edit.text}${spacingFormatted.slice(edit.end)}`
  }

  return spacingFormatted
}

/**
 * @param {Set<number>} offsets
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {TsNode} previousNode
 * @param {TsNode} nextNode
 * @returns {void}
 */
function addBlankLineBefore(offsets, text, sourceFile, lineStarts, previousNode, nextNode) {
  const previousEnd = previousNode.getEnd()
  const nextStartLine = getStartLineIncludingLeadingComments(text, sourceFile, lineStarts, nextNode, previousEnd)
  if (hasBlankLineBetween(sourceFile, previousEnd, nextStartLine)) return

  offsets.add(nextStartLine)
}

/**
 * @param {Set<number>} offsets
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {ReadonlyArray<Statement>} statements
 * @returns {void}
 */
function collectStatementSpacing(offsets, text, sourceFile, lineStarts, statements) {
  for (let index = 1; index < statements.length; index++) {
    const previous = statements[index - 1]
    const current = statements[index]
    if (!(previous && current)) continue

    if (ts.isReturnStatement(current)) {
      addBlankLineBefore(offsets, text, sourceFile, lineStarts, previous, current)
    }

    if (isFunctionLikeStatement(previous) && isFunctionLikeStatement(current)) {
      addBlankLineBefore(offsets, text, sourceFile, lineStarts, previous, current)
    }
  }
}

/**
 * @param {Set<number>} offsets
 * @param {string} text
 * @param {SourceFile} sourceFile
 * @param {readonly number[]} lineStarts
 * @param {ReadonlyArray<ClassElement>} members
 * @returns {void}
 */
function collectClassMemberSpacing(offsets, text, sourceFile, lineStarts, members) {
  for (let index = 1; index < members.length; index++) {
    const previous = members[index - 1]
    const current = members[index]
    if (!(previous && current)) continue
    if (!(isFunctionLikeClassMember(previous) && isFunctionLikeClassMember(current))) continue

    addBlankLineBefore(offsets, text, sourceFile, lineStarts, previous, current)
  }
}

/*
 * Formatter
 */

/**
 * Applies the project spacing rules that Biome does not currently expose:
 * one blank line before non-leading returns and one blank line between
 * adjacent function-like declarations.
 *
 * @param {string} filePath
 * @param {string} text
 * @param {string | undefined} [languageId]
 * @returns {string}
 */
function formatText(filePath, text, languageId) {
  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, getScriptKind(filePath, languageId))
  const lineStarts = sourceFile.getLineStarts()
  /** @type {Set<number>} */
  const offsets = new Set()

  /**
   * @param {TsNode} node
   * @returns {void}
   */
  function visit(node) {
    if (ts.isSourceFile(node) || ts.isBlock(node) || ts.isCaseClause(node) || ts.isDefaultClause(node) || ts.isModuleBlock(node)) {
      collectStatementSpacing(offsets, text, sourceFile, lineStarts, node.statements)
    }

    if (ts.isClassLike(node)) {
      collectClassMemberSpacing(offsets, text, sourceFile, lineStarts, node.members)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  let formatted = text
  for (const offset of [...offsets].sort((a, b) => b - a)) {
    formatted = `${formatted.slice(0, offset)}\n${formatted.slice(offset)}`
  }

  // Apply CSS cleanup inside styled-components template literals for TSX files.
  if (getScriptKind(filePath, languageId) === ts.ScriptKind.TSX) {
    const cssSourceFile = ts.createSourceFile(filePath, formatted, ts.ScriptTarget.Latest, true, getScriptKind(filePath, languageId))
    formatted = formatStyledComponentsCss(formatted, cssSourceFile)
  }

  return formatted
}

/*
 * Command runner
 */

/**
 * @param {readonly string[]} argv
 * @returns {Promise<number>}
 */
async function runCli(argv = process.argv.slice(2)) {
  const checkOnly = argv.includes(CHECK_FLAG)
  const roots = argv.filter((arg) => arg !== CHECK_FLAG)
  const inputPaths = roots.length > 0 ? roots : DEFAULT_ROOTS
  const files = (await Promise.all(inputPaths.map((inputPath) => collectCodeFiles(inputPath)))).flat().sort()
  /** @type {string[]} */
  const changedFiles = []

  for (const file of files) {
    const text = await readFile(file, 'utf8')
    const formatted = formatText(file, text)
    if (formatted === text) continue

    changedFiles.push(file)
    if (!checkOnly) await writeFile(file, formatted)
  }

  if (changedFiles.length === 0) {
    console.log('Code spacing already matches the project convention.')

    return 0
  }

  if (checkOnly) {
    console.error(`Code spacing needs formatting in ${changedFiles.length} file(s):`)
    for (const file of changedFiles) console.error(`- ${file}`)

    return 1
  }

  console.log(`Code spacing formatted ${changedFiles.length} file(s).`)

  return 0
}

if (require.main === module) {
  runCli()
    .then((exitCode) => {
      process.exitCode = exitCode
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    })
}

module.exports = { formatText, runCli }
