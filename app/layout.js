export const metadata = {
  title: 'TechStore - Produtos',
  description: 'Consulta e cadastro de produtos da TechStore',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
