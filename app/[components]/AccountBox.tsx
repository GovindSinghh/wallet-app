const AccountBox=({accountNo,privateKey,publicKey}:{
    accountNo:number;
    publicKey:string;
    privateKey:string;
})=>{
    return(
        <div className="border-2 rounded-lg border-black-200 text-white hover:shadow:2xl p-6 m-2 h-fit w-fit">
            <span className="text-xl">Wallet {accountNo}</span>
            <pre>Private Key: {privateKey}</pre>
            <pre>Public Key: {publicKey}</pre>
        </div>
    )
}

export { AccountBox };