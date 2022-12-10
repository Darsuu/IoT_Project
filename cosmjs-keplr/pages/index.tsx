import type { NextPage } from 'next'
import { FaucetSender } from '../components/FaucetSender'
import { HomePage } from '../components/Home'

const Home: NextPage = () => {
  return <HomePage userAddress="cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he" rpcUrl="https://rpc.sentry-02.theta-testnet.polypore.xyz"/>
}

export default Home