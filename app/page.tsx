'use client'
import Image from "next/image";
import { generateMnemonic } from "bip39";
import {  useState } from "react";
import generateKeysWithPhrase from "./[utils]/CreateWallet";
import { AccountBox } from "./[components]/AccountBox";

export default function Home() {

  const [seedPhrase,setSeedPhrase]=useState<string | null>(null);
  const [privateKey,setPrivateKey]=useState<string | null>(null);
  const [publicKey,setPublicKey]=useState<string | null>(null);
  const [accountNoFromInputSeed,setAccountNoFromInputSeed]=useState<number>(1);
  const [accountNoFromCreatedSeed,setAccountNoFromCreatedSeed]=useState<number>(1);
  const [phraseFromUser,setPhraseFromUser]=useState<string | null >(null);

  let accounts=[];

  function handleGenerate(){
    if(!phraseFromUser){
      let nextAccountNo = accountNoFromCreatedSeed;
      let newSeedPhrase = seedPhrase;
      let keypair;

      if (!seedPhrase) {
        newSeedPhrase = generateMnemonic(128);
        keypair = generateKeysWithPhrase(newSeedPhrase, `m/44'/501'/1'`);
      } else {
        keypair = generateKeysWithPhrase(newSeedPhrase as string, `m/44'/501'/${nextAccountNo}'`);
      }
      setPrivateKey(keypair.privateKey);
      setPublicKey(keypair.publicKey);
      setSeedPhrase(newSeedPhrase);
      setAccountNoFromCreatedSeed(nextAccountNo + 1);
      setAccountNoFromInputSeed(1);
    }
    else{
      let nextAccountNo = accountNoFromInputSeed;
      const trimmedPhrase = phraseFromUser.trim();
      const keypair = generateKeysWithPhrase(trimmedPhrase, `m/44'/501'/${nextAccountNo}'`);
      setPrivateKey(keypair.privateKey);
      setPublicKey(keypair.publicKey);
      setSeedPhrase(seedPhrase);
      setAccountNoFromInputSeed(nextAccountNo + 1);
      setAccountNoFromCreatedSeed(1);
      setSeedPhrase(null);
    }
  }

  function handleInputChange(e:any){
    e.preventDefault();
    const value=e.target.value;
    setPhraseFromUser(value);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <input
        type="text"
        placeholder="Enter you seed phrase or Click generate to get new phrase"
        className="w-[500px] rounded-lg text-white p-5 m-2 border-white"
        onChange={(e)=>handleInputChange(e)}
        />

        <button
        className="p-4 rounded-xl border-1 border-white text-white hover:shadow-2xl cursor-pointer"
        onClick={handleGenerate}> Generate key </button><br />

        {(seedPhrase || phraseFromUser) && <div>seed phrase : {seedPhrase || phraseFromUser}</div>}
        {(publicKey && privateKey) && <AccountBox accountNo={!phraseFromUser ? accountNoFromCreatedSeed-1 : accountNoFromInputSeed-1} publicKey={publicKey} privateKey={privateKey}/>}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
