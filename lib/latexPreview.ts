function hasOddTrailingBackslashes(value: string) {
  let count = 0;
  for (let i = value.length - 1; i >= 0 && value[i] === "\\"; i -= 1) {
    count += 1;
  }
  return count % 2 === 1;
}

function stripLineComment(line: string) {
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === "%" && !hasOddTrailingBackslashes(line.slice(0, i))) {
      return line.slice(0, i);
    }
  }
  return line;
}

export function stripLatexComments(latex: string) {
  return latex
    .replace(/\\begin\{comment\}[\s\S]*?\\end\{comment\}/g, "")
    .split("\n")
    .map(stripLineComment)
    .join("\n");
}

export function previewContentFromLatex(latex: string) {
  return stripLatexComments(latex)
    .replace(/\\documentclass[\s\S]*?\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "")
    .replace(/\\resumeName\{([^{}]*)\}/g, "\n$1\n")
    .replace(/\\resumeContact\{([^{}]*)\}/g, "$1\n")
    .replace(/\\subsection\*\{([^}]+)\}/g, "\n## $1")
    .replace(/\\section\*\{([^}]+)\}/g, "\n# $1")
    .replace(/\\begin\{itemize\}|\\end\{itemize\}/g, "")
    .replace(/\\begin\{center\}|\\end\{center\}/g, "")
    .replace(/\\item\s+/g, "- ")
    .replace(/\\\\/g, "\n")
    .replace(/\\textbf\{([^{}]+)\}/g, "$1")
    .replace(/\\textit\{([^{}]+)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{[^{}]*\})?/g, "")
    .replace(/[{}]/g, "")
    .replace(/\\%/g, "%")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
