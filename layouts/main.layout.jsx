import Head from "next/head";

export default function MainLayout({ children }) {
  return (
    <>
      <Head>
        <title>ECDSA Node</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>
    </>
  );
}
