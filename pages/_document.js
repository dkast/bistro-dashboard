import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="UTF-8" />
          <title>Bistro Dashboard</title>
          <meta name="description" content="Bistro Dashboard" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
          <link rel="apple-touch-icon" href="/static/touch-icon.png" />
          <link
            rel="mask-icon"
            href="/static/favicon-mask.svg"
            color="#49B882"
          />
          <link rel="icon" href="/static/favicon.ico" />
          <meta property="og:description" content="Bistro Dashboard" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700"
            rel="stylesheet"
          />
          <link href="/static/css/tabler.css" rel="stylesheet" />
          <link href="/static/css/bg-svg.css" rel="stylesheet" />
          {/* Using Next-CSS plugin */}
          <link href="/_next/static/style.css" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
