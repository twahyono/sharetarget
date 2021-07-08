import { useRouter } from 'next/router'

export default function Target() {
    const router = useRouter();
    console.log(router.query);
    return(
        <>
        </>
    )
}