import Image from 'next/image'
import Link from 'next/link'


const Logo = () => {
  return (
    <div>
      <Link href={"/"}>
        <Image src="/logo.png?v=1" alt="Logo" width={100} height={100} quality={100} unoptimized />
      </Link>
    </div>
  )
}

export default Logo