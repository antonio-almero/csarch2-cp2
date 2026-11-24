export function Header(){
    return (
        <header className="flex justify-between items-center bg-[#000080] p-4">
            <h1 className="text-base font-bold text-white">Full Associative Cache Memory Machines</h1>
            <div className="flex flex-row gap-6">
                <div className="text-sm  text-white flex flex-row gap-10">
                    <div className="text-xs justify-center items-center text-white flex flex-col">
                        <h2 className = "font-bold">CSARCH2 - S40A</h2>
                        <h2 className = "font-bold">Group 6</h2>
                    </div>
                    <div className="text-xs items-center justify-center text-white flex flex-row gap-2">
                        <h2><span className="font-bold">Almero</span>,  Antonio Alvaro -</h2>
                        <h2><span className="font-bold">Chua</span>, Jasper -</h2>
                        <h2><span className="font-bold">Marquez</span>, John Thomas -</h2>
                        <h2><span className="font-bold">Panlilio</span>, Yuan Miguel -</h2>
                        <h2><span className="font-bold">So</span>, Nigel Henry</h2>
                    </div>
                </div>
            </div>
        </header>
    )
}