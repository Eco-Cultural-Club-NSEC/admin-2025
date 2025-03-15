// The base64 encoded Morbitrone font
export const MorbitroneFontBase64 = "..."; // Add your base64 encoded font here

export function injectFontStyles(html: string): string {
  return html.replace(
    /@font-face\s*{[^}]*}/g,
    `@font-face {
      font-family: 'Morbitrone';
      src: url(data:application/x-font-woff;charset=utf-8;base64,${MorbitroneFontBase64}) format('woff');
      font-weight: normal;
      font-style: normal;
    }`
  );
}
