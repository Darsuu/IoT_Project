import { Coin, StargateClient } from "@cosmjs/stargate"
import { ChangeEvent, Component, MouseEvent } from "react"
import styles from '../styles/Home.module.css'
import { Window as KeplrWindow } from "@keplr-wallet/types";
import Form from './Form';
import Query from './Query';

declare global {
    interface Window extends KeplrWindow {}
}

interface UserState {
    myAddress: string
    myBalance: string
    toSend: string
}

export interface FaucetSenderProps {
    userAddress: string
    rpcUrl: string
}

export class HomePage extends Component<FaucetSenderProps, UserState> {

    init = async()=> this.updateUserBalance(await StargateClient.connect(this.props.rpcUrl))
    // Set the initial state
    constructor(props:FaucetSenderProps) {
        super(props)
        this.state = {
            myAddress: "Click first",
            myBalance: "Click first",
            toSend: "0",
        }
        setTimeout(this.init,500)
    }

    // CURRENTLY SHOWS FAUCET BALANCE
    updateUserBalance = async(client: StargateClient) => {
        const balances: readonly Coin[] = await client.getAllBalances(this.props.userAddress)
        const first: Coin = balances[0]
        this.setState({
            myAddress: this.props.userAddress,
            myBalance: first.amount,
        })
    }

    // Store changed token amount to state
    onToSendChanged = (e: ChangeEvent<HTMLInputElement>) => this.setState({
        toSend: e.currentTarget.value
    })

    // The render function that draws the component at init and at state change
    render() {
        const { myAddress, myBalance, toSend } = this.state
        const { userAddress, rpcUrl } = this.props
        console.log(toSend)
        return <div>
            <fieldset className={styles.card}>
                <legend>You</legend>
                <p>Address: {myAddress}</p>
                <p>Balance: {myBalance}</p>
            </fieldset>
            <div className = {styles.box}>
            <fieldset className={styles.card}>
                <legend> Add post </legend>
                <Form/>
            </fieldset>
            <fieldset className={styles.card}>
                <legend> Query </legend>
                <Query/>
            </fieldset>
            </div>
        </div>
    }
}