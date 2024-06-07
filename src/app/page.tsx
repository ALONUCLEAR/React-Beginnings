import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import('./components/board/board'), { ssr: false });

export default function Home() {
  return <NoSSR width={3}></NoSSR>;
}