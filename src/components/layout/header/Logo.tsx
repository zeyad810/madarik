import Image from 'next/image'
import Link from 'next/link'


const Logo = () => {
  return (
    <div>
      <Link href={"/"} >
        <Image src={"/logo.png"} alt="Logo" width={100} height={100} />
      </Link>
    </div>
  )
}

export default Logo