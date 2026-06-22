import Link from 'next/link'

export default function Header() {
    return(
       <div className="w-full h-auto flex flex-row border-1 border-black box-border">
                <div className='max-w-7xl w-full flex flex-row border-1 border-red-200 p-2.5 mx-auto bg-white'>
                    <div>

                    </div>

                    <nav> 
                        <Link href={'/'}>Home</Link>
                    </nav>
            </div>
        </div>
    )
}