import { StargateClient } from "@cosmjs/stargate" // READ ONLY CLIENT
import { IndexedTx } from "@cosmjs/stargate" // TO GET TRANSACTION HASH
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx" // TO DESERIALISE TX
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx" // TO DESERIALISE MSGSEND
import { SigningStargateClient } from "@cosmjs/stargate" // TO SEND TRANSACTIONS TO THE FAUCET requires OfflineDirectSigner
import { readFile } from "fs/promises" //NEED ACCESS TO ALICE'S PRIVATE KEY FOR TRANSACTIONS
import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing" 


const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657"

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1HdWallet.fromMnemonic("reason gun course fringe estate snow island poverty cloud ethics rib gasp crush any harbor adapt notice blur raw monkey expand output federal moral", {
        prefix: "cosmos",
    })
}

const runAll = async(): Promise<void> => {
    const client = await StargateClient.connect(rpc)
    //console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())
    const faucetTx: IndexedTx = (await client.getTx(
        "F43E8784145DD84E238127BE2120C1E9476D54134ABD3C19FD2F062AC2FA0057",
    ))!
    //console.log("Faucet Tx:", faucetTx)
    const decodedTx: Tx = Tx.decode(faucetTx.tx)
    const sendMessage: MsgSend = MsgSend.decode(decodedTx.body!.messages[0].value)
    const faucet: string = sendMessage.fromAddress //faucet address
    // console.log("Faucet Balances:", await client.getAllBalances("cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he"))

    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic()
    const alice = (await aliceSigner.getAccounts())[0].address
    console.log("Alice's address from signer", alice)
    const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner)

    console.log(
        "With signing client, chain id:",
        await signingClient.getChainId(),
        ", height:",
        await signingClient.getHeight()
    )
    
    //console.log("DecodedTx:", decodedTx)
    //console.log("Decoded messages:", decodedTx.body!.messages) // This doesn't deserialize the messages because each message is of its own type
    // we get '/cosmos.bank.v1beta1.MsgSend' from this log which comes from Protobuf definitions and is a mixture of the name of package and message

    // console.log(
    //     "Alice balances:",
    //     await client.getAllBalances("cosmos1zsnmmq744yj4uu5nt8jn92ewn2edx4hcutzytg"), // Using getAllBalances because we don't know the default token name
    // )

// Check the balance of Alice and the Faucet
console.log("Alice balance before:", await client.getAllBalances(alice))
console.log("Faucet balance before:", await client.getAllBalances(faucet))
// Execute the sendTokens Tx and store the result
const result = await signingClient.sendTokens(
    alice,
    faucet,
    [{ denom: "uatom", amount: "10" }],
    {
        amount: [{ denom: "uatom", amount: "500" }],
        gas: "200000",
    },
)
// Output the result of the Tx
console.log("Transfer result:", result)
console.log("Alice balance after:", await client.getAllBalances(alice))
console.log("Faucet balance after:", await client.getAllBalances(faucet))


}



runAll()

