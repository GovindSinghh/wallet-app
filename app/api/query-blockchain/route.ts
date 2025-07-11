import { Connection,PublicKey,LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, Signer } from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
const SOLANA_RPC_URL=process.env.SOLANA_RPC_URL;

let connection:Connection;
if(SOLANA_RPC_URL){
    connection=new Connection(SOLANA_RPC_URL,"confirmed");
}

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

    return signature;
}

// route handling
export async function POST(req: NextRequest) {
    const { action, ...params } = await req.json();

    if (!connection) {
        return NextResponse.json({ error: "No Solana connection" });
    }

    try {
        let result;
        switch (action) {
            case "getBalance":
                result = await getBalance(connection, params.publicKey);
                return NextResponse.json({ balance: result });
            case "airdrop":
                result = await airDropSOL(connection, params.publicKey);
                return NextResponse.json({ signature: result });
            case "sendTransaction":
                result = await sendTransaction(
                    connection,
                    params.fromPrivateKey,
                    params.fromPublicKey,
                    params.toPublicKey,
                    params.amountInSOL
                );
                return NextResponse.json({ signature: result });
            default:
                return NextResponse.json({ error: "Invalid action" });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message });
        }
        return NextResponse.json({ error: "An unknown error occurred" });
    }
}