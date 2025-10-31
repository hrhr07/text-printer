export const metadata = {
  title: "Text Printer (WebUSB)",
  description: "Aplicación Next.js para imprimir texto mediante WebUSB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
