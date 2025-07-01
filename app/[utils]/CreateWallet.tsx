import { mnemonicToSeedSync,validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58";

const generateKeysWithPhrase=(mnemonic:string,derevationPath:string)=>{
    if(!validateMnemonic(mnemonic)){
        console.log("Invalid Phrase");
        throw new Error("Invalid Seed Phrase");
    }
    console.log(derevationPath);
    const seed = mnemonicToSeedSync(mnemonic);

    const derivedSeed=derivePath(derevationPath,seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey=Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey=bs58.encode(secret);
    
    return { privateKey,publicKey };
}

export default  generateKeysWithPhrase;