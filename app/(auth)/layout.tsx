import Header from "@/components/shared/header";
import Footer from "@/components/ui/footer";

export default function RAuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
          
            <main className="flex-1 wrapper">
                {children}
            </main>
           
        </div>
    );
}