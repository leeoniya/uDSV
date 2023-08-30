function genTable(results, header) {
  const heads = Object.keys(results[0]);

  const widths = heads.map(h => h.length);

  const texts = results.map((res, i) => {
    let out = Object.values(res);

    widths.forEach((w, i) => {
      widths[i] = Math.max(w, out[i].length);
    });

    return out;
  });

  let fullWidth = widths.reduce((acc, w) => acc + w + 3, 0) - 3;

  let table = [
    "┌" + "─".repeat(fullWidth + 2) + "┐",
    "│ " + header.padEnd(fullWidth, " ") + " │",
    "├" + widths.map((w, i) => "─".repeat(w + 2)).join("┬") + "┤",
    "│" + widths.map((w, i) => (" " + heads[i]).padEnd(w + 2, " ")).join("│") + "│",
    "├" + widths.map((w, i) => "─".repeat(w + 2)).join("┼") + "┤",
    ...texts.map(res =>
      "│" + widths.map((w, i) => (" " + res[i]).padEnd(w + 2, " ")).join("│") + "│"
    ),
    "└" + widths.map(w => "─".repeat(w + 2)).join("┴") + "┘",
  ].join('\n');

  return table;
}

exports.genTable = genTable;