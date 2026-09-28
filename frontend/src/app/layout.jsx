import './globals.css';

export const metadata = {
  title: 'IDX Quant Command Center',
  description: 'Institutional Grade Market Scanner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#090a0f] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}