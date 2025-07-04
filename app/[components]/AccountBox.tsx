'use client'
import { useState } from "react";
import { airDropSOL, getBalance, getConnectionObject } from "../[utils]/QueryBlockchain";

const AccountBox=({accountNo,privateKey,publicKey}:{
    accountNo:number;
    publicKey:string;
    privateKey:string;
})=>{
    const [balance,setBalance]=useState<number>(0);
    
    async function airDrop(){
        const connection=getConnectionObject();
        if(connection){
            const airdropSignature=await airDropSOL(connection,publicKey);
            console.log("Airdrop sign : ",airdropSignature);
            setTimeout(async ()=>{
                const currBalance=await getBalance(connection,publicKey);
                console.log("Balance is : ",currBalance);
                setBalance(currBalance);
            },3000);
        }
    }
    return(
        <div className="border-2 rounded-lg border-black-200 text-white hover:shadow:2xl p-6 m-2 h-fit w-fit">
            <span className="text-xl">Wallet {accountNo}</span>
            <pre>Private Key: {privateKey}</pre>
            <pre>Public Key: {publicKey}</pre>
            <pre>Your Balance is : <span className="font-bold text-lg">{balance} SOL</span></pre>
            <div>
            <button className="border-2 hover:shadow-2xl rounded-xl p-3 m-2 cursor-pointer" onClick={airDrop}>Airdrop SOL</button>
            <button className="border-2 hover:shadow-2xl rounded-xl p-3 m-2 cursor-pointer">SEND SOL</button>
            </div>
        </div>
    )
}

export { AccountBox };