class Account{
    private privateKey:string;
    public publicKey:string;
    constructor(secret:string,publicKey:string,Account_No:string){
        this.privateKey=secret;
        this.publicKey=publicKey;
    }
}