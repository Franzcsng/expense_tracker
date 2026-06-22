import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="w-full min-h-full flex flex-col bg-white">
            <Header/>
            <div className="h-full">{children}</div>
            <Footer/>
        </div>
    )
}