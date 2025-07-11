'use client'
import { generateMnemonic } from "bip39";
import {  useState } from "react";
import { generateKeysWithPhrase }  from "./[utils]/methods";
import { AccountBox } from "./[components]/AccountBox";
import { Github, Linkedin, Twitter } from "lucide-react";
interface UserAccountDataType{
  walletNo:number;
  publicKey: string | null;
  privateKey: string | null;
  balance: number
}

export default function Home() {

  const [wallets, setWallets] = useState<UserAccountDataType[]>([]);
  const [seedPhrase,setSeedPhrase]=useState<string | null>(null);
  const [accountData, setAccountData] = useState<UserAccountDataType>({walletNo:0, publicKey: null, privateKey: null, balance: 0 });
  const [accountNoFromInputSeed,setAccountNoFromInputSeed]=useState<number>(1);
  const [accountNoFromCreatedSeed,setAccountNoFromCreatedSeed]=useState<number>(1);
  const [phraseFromUser,setPhraseFromUser]=useState<string | null >(null);


  function handleGenerate(){
    let newAccountData;
    if(!phraseFromUser){
      const nextAccountNo = accountNoFromCreatedSeed;
      let newSeedPhrase = seedPhrase;
      let keypair;
      if (!seedPhrase) {
        newSeedPhrase = generateMnemonic(128);
        keypair = generateKeysWithPhrase(newSeedPhrase, `m/44'/501'/1'`);
      } else {
        keypair = generateKeysWithPhrase(newSeedPhrase as string, `m/44'/501'/${nextAccountNo}'`);
      }
      newAccountData = {walletNo:accountNoFromCreatedSeed, publicKey: keypair.publicKey, privateKey: keypair.privateKey, balance: 0 };
      setSeedPhrase(newSeedPhrase);
      setAccountNoFromCreatedSeed(nextAccountNo + 1);
      setAccountNoFromInputSeed(1);
    } else {
      const nextAccountNo = accountNoFromInputSeed;
      const trimmedPhrase = phraseFromUser.trim();
      const keypair = generateKeysWithPhrase(trimmedPhrase, `m/44'/501'/${nextAccountNo}'`);
      newAccountData = { walletNo:accountNoFromInputSeed,publicKey: keypair.publicKey, privateKey: keypair.privateKey, balance: 0 };
      setSeedPhrase(seedPhrase);
      setAccountNoFromInputSeed(nextAccountNo + 1);
      setAccountNoFromCreatedSeed(1);
      setSeedPhrase(null);
    }
    if(newAccountData.publicKey) {
      setWallets(prev => [...prev, newAccountData]);
    }
    setAccountData(newAccountData);
  }

  function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
    e.preventDefault();
    const value=e.target.value;
    setPhraseFromUser(value);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-green-900 to-gray-900 bg-fixed flex flex-col items-center justify-center p-0 m-0" style={{background: 'linear-gradient(120deg, #0f2027 0%, #2c5364 100%)'}}>
      <main className="flex flex-col gap-[14px] row-start-2 items-center sm:items-start w-full max-w-2xl mt-16 bg-black/70 rounded-2xl shadow-2xl p-8 border border-green-800 backdrop-blur-md" style={{boxShadow: '0 0 40px #00ff00a0'}}>
        <input
        type="text"
        placeholder="Enter your seed phrase or Click generate to get new phrase"
        className="w-full max-w-xl rounded-lg text-green-300 bg-black/80 p-5 m-2 border-green-600 focus:border-green-400 focus:outline-none placeholder-green-700 shadow-inner transition-all duration-300"
        onChange={(e)=>handleInputChange(e)}
        />

        <button
        className="p-3 rounded-xl border-2 border-green-800 text-green-200 bg-black/80 hover:bg-green-800 hover:text-black hover:shadow-hacker transition-all duration-300 cursor-pointer tracking-widest shadow-md"
        onClick={handleGenerate}>{accountData.publicKey ? "Add Wallet" :"Generate key"} </button><br />

        {(seedPhrase || phraseFromUser) && <><span className="text-md text-gray-400">Seed Phrase</span>
          <pre className="break-all text-xs bg-gray-900 rounded-lg p-1 select-all cursor-pointer hover:bg-gray-700 transition-colors duration-200 overflow-hidden blur-xs hover:blur-none">{seedPhrase || phraseFromUser}</pre></>}

        {wallets.map((wallet, idx) => (
          wallet.publicKey && wallet.privateKey && (
            <AccountBox
              key={wallet.walletNo}
              accountData={wallet}
              setAccountData={(updatedWallet: UserAccountDataType) => {
                setWallets(prevWallets => prevWallets.map((w, i) => i === idx ? updatedWallet : w));
              }}
            />
          )
        ))}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mt-20 text-green-700">
        <a
          href="https://github.com/GovindSinghh/wallet-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>
        <a
          href="https://www.linkedin.com/in/govind-singh-a925471a1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin />
        </a>
        <a
          href="https://x.com/GovindS34844958"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter />
        </a>
      </footer>
    </div>
  );
}
