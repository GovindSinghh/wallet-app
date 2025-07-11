'use client'
import { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import axios from "axios";

const AccountBox=({accountData,setAccountData}:{
    accountData: {
        walletNo: number;
        publicKey: string | null;
        privateKey: string | null;
        balance: number;
    };
    setAccountData: (updatedWallet: {
        walletNo: number;
        publicKey: string | null;
        privateKey: string | null;
        balance: number;
    }) => void;
})=>{
    const [receiverPublicAddress,setReceiverPublicAddress]=useState<string | null>(null);
    const [amountToSend,setAmountToSend]=useState<number>(0);
    const [showDetails, setShowDetails] = useState(false);
    
    async function getUserBalance(){
        if(accountData.publicKey){
            const res = await axios.post('/api/query-blockchain', {
                action: "getBalance",
                publicKey: accountData.publicKey // replace with actual public key variable
            });
            setAccountData({
                ...accountData,
                balance:res.data.balance
            });
        }
    }
    async function airDrop(){
        if(accountData.publicKey){
            const res = await axios.post('/api/query-blockchain', {
                action: "airdrop",
                publicKey: accountData.publicKey
            });
            console.log("Airdrop sign : ",res.data.signature);
            setTimeout(async ()=>{
                await getUserBalance();
            },5000);
        }
    }
    function handleReceiverAddress(e:React.ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        const val=e.target.value;
        setReceiverPublicAddress(val);
    }
    async function sendSOL(){
        if(receiverPublicAddress && amountToSend != 0 && amountToSend < accountData.balance && accountData.privateKey && accountData.publicKey){
            const res = await axios.post('/api/query-blockchain', {
                action: "sendTransaction",
                fromPrivateKey: accountData.privateKey,
                fromPublicKey: accountData.publicKey,
                toPublicKey: receiverPublicAddress,
                amountInSOL: amountToSend
            });
            console.log("Sol sended: ", res.data.signature);
            setTimeout(async ()=>{
                await getUserBalance();
            },10000);
        }
    }
    return(
        <div className="relative border-2 rounded-2xl border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-white p-8 m-4 w-full max-w-md flex flex-col gap-6 items-center group">
            {/* Show/hide button */}
            <button
                className="absolute top-4 right-4 z-10 flex flex-col items-center cursor-pointer focus:outline-none group"
                onClick={() => {
                    setShowDetails((prev) => !prev)
                }}
                aria-label={showDetails ? "Hide Account Details" : "Show Account Details"}
            >
                <span className={`text-green-400 text-2xl transition-transform duration-300 `}>{showDetails ? <ChevronUp /> : <ChevronDown />}</span>
            </button>
            {/* Animated details */}
            <div className={`transition-all duration-700 ease-in-out overflow-hidden w-full ${showDetails ? 'max-h-[500px] opacity-100 scale-100 mt-0' : 'max-h-[27px] opacity-100 scale-95 pointer-events-none'}`}>
                <span className="text-2xl font-bold tracking-wide mb-2 group-hover:text-yellow-400 transition-colors duration-300">Wallet {accountData.walletNo}</span>
                <div className="w-full flex flex-col gap-2 bg-gray-800 rounded-lg p-4 my-5 transition-transform duration-300 hover:scale-105">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400">Private Key:</span>
                        <pre className="break-all text-xs bg-gray-900 rounded p-2 select-all cursor-pointer hover:bg-gray-700 transition-colors duration-200 overflow-hidden hover:overflow-x-auto blur-xs hover:blur-none">{accountData.privateKey}</pre>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-sm text-gray-400">Public Key:</span>
                        <pre className="break-all text-xs bg-gray-900 rounded p-2 select-all cursor-pointer hover:bg-gray-700 transition-colors duration-200">{accountData.publicKey}</pre>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div>
                        <span className="text-base text-gray-300 mr-1">Your Balance is</span>
                        <span className="font-bold text-lg text-green-400 transition-colors duration-300 group-hover:text-yellow-300"><i>{accountData.balance} SOL</i></span>
                    </div>
                    <button onClick={()=> getUserBalance()} className="bg-gradient-to-l from-slate-600 to-slate-900 hover:from-gray-700 to-gray-500 p-2 rounded-md text-xs cursor-pointer hover:ring-2 hover:ring-gray-500 transition-all duration-700 ease-in-out">CHECK BALANCE</button>
                </div>
                <div className="flex flex-col gap-4 w-full mt-4 items-center">
                    <button className=" bg-gradient-to-l from-slate-600 to-slate-900 hover:from-gray-700 to-gray-500 text-white font-semibold rounded-xl py-3 px-6 shadow-md hover:shadow-lg transition-all duration-700 cursor-pointer w-full" onClick={airDrop}>
                        💸 Airdrop SOL
                    </button>
                        <div className="grid grid-cols-2">
                            <input
                                type="text"
                                placeholder="Receiver Public Address"
                                onChange={handleReceiverAddress}
                                className="grid col-span-1 rounded-lg p-3 bg-gray-900 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-inner"
                            />
                            <input
                                type="text"
                                placeholder="Amount"
                                onChange={(e)=> setAmountToSend(Number(e.target.value))}
                                className="grid col-span-1 rounded-lg p-3 bg-gray-900 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-inner"
                            />
                        </div>
                        <span className="text-xs text-yellow-200">Click Check balance after transaction</span>
                        <button className=" hover:ring-2 hover:ring-gray-500 bg-gradient-to-r w-fit from-slate-600 to-slate-900 hover:from-gray-700 to-gray-500 font-semibold rounded-xl py-3 px-15 shadow-md transition-all duration-700 cursor-pointer" onClick={sendSOL}>
                                <Send />
                        </button>
                </div>
            </div>
        </div>
    )
}

export { AccountBox };