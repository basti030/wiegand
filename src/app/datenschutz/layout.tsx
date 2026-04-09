import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz | Autohaus Wiegand",
  description: "Informationen zum Datenschutz und zum Umgang mit Ihren personenbezogenen Daten bei Autohaus Wiegand.",
};

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
