import { useRouter } from 'next/router'

export default function Target() {
    const router = useRouter();
    console.log(router.query);
    return(
        <>
        <p>{router.query.title}</p>
        <p>{router.query.text}</p>
        <p>{router.query.url}</p>
        </>
    )
}