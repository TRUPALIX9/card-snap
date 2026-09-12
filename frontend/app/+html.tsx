import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#ffffff" />

        {/* Prevents unwanted scroll bounce behavior in web apps */}
        <ScrollViewStyleReset />

        {/* Anti-flicker dark/light background color support */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />

        {/* Optional: Favicon / Web Manifest / Fonts */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="preload" as="font" href="/fonts/SpaceMono-Regular.ttf" type="font/ttf" crossOrigin="anonymous" /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
  margin: 0;
  padding: 0;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
}
}`;
