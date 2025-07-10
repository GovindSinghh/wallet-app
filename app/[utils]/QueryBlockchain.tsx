import { Connection,PublicKey,LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, Signer } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";
const SOLANA_RPC_URL=process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";


const connection=new Connection(SOLANA_RPC_URL,"confirmed");

const airDropSOL = async (connection: Connection, publicKeyString: string, amountInSOL: number = 1) => {
    let tries=3;
    const publicKey = new PublicKey(publicKeyString);
    while(tries-- > 0){
        try {
            const airdropSignature = await connection.requestAirdrop(
                publicKey,
                amountInSOL * LAMPORTS_PER_SOL
            );
    
            return airdropSignature;
        } catch (error) {
            console.error("Airdrop failed:", error);
            throw error;
        }
    }

    throw new Error("Airdrop failed after multiple attempts");
};

const getBalance=async(connection:Connection,publicKey:string)=>{
    const balanceInLamports=await connection.getBalance(new PublicKey(publicKey));
    const balanceInSOL=(balanceInLamports/LAMPORTS_PER_SOL);
    return balanceInSOL;
}

const sendTransaction=async(connection:Connection,fromPrivateKey:string,fromPublicKey:string,toPublicKey:string,amountInSOL:number)=>{
    // remember keys are base58 encoded, so convert them to actual form ALWAYS
    const SENDER_PRIVATE_KEY=bs58.decode(fromPrivateKey);
    const SENDER_ADDRESS=new PublicKey(fromPublicKey);
    const RECEIVER_ADDRESS=new PublicKey(toPublicKey);

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: SENDER_ADDRESS,
        toPubkey: RECEIVER_ADDRESS,
        lamports: amountInSOL * LAMPORTS_PER_SOL
    });
    
    const signer:Signer={
        publicKey:SENDER_ADDRESS,
        secretKey:SENDER_PRIVATE_KEY
    }
    const transaction=new Transaction().add(transferInstruction);
    // send the transaction to the network
    const signature=await sendAndConfirmTransaction(
        connection,
        transaction,
        [signer]
    );
    const remainingBalance=await getBalance(connection,fromPublicKey);

    return { signature,remainingBalance};
}

export {
    connection,
    airDropSOL,
    getBalance,
    sendTransaction
};