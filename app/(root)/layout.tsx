import Header from "@/components/shared/header";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
            <Header/>
            <main className="flex-1 wrapper">
                {children}
                <Toaster richColors position="bottom-right" />
            </main>
            <Footer/>
        </div>
    );
}