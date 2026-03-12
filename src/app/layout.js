import './globals.css';

export const metadata = {
  title: '2.4" Widget Catalog',
  description: 'RAG Component Viewer – 2.4-inch widget catalog',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
