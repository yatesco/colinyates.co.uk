const DATE_REG_EXP = /\d{4}\ \d{2}\ \d{2}\ /i;
export const stripDateFromTitle = (title: string): string => {
  return title.replace(DATE_REG_EXP, "");
};

// effort to try and only extract whole words....
export const extractPreview = (orig: string, orig_n: number): string => {
  let n = Math.min(orig_n, orig.length);
  if (orig.length < n) {
    return orig;
  }
  const s = orig.substring(0, n);
  // console.log("STARTED WITH", s);

  while (n > 0 && s[n] != " ") {
    // console.log("n", n, "s[n]", s[n]);
    n--;
  }

  const result = s.substring(0, n);

  // console.log("RETURNING up to", n, "which is", result);
  return result;
};
