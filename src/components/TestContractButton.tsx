import React from 'react';
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
    toHex,
    PubKey,
    findSig,
    SignatureResponse,
    ByteString,
    hash160,
    PubKeyHash,
    Signer,
    SensiletSigner
} from 'scrypt-ts'
import { TestCompile } from '../contracts/testCompile';
  
  const TestContractButton = () => {

    // Define your logic for creating the contract here
    const handleTestContract = async () => {
      try {
        const provider = new DefaultProvider();
        const signer = new SensiletSigner(provider);
        await signer.requestAuth()
        const network = await signer.getNetwork()
        await provider.updateNetwork(network)
        await signer.connect(provider)

        const instance = new TestCompile(1n);
        await instance.connect(signer);
        const tx = await instance.deploy()
        console.log('tx.id: ', tx.id)

        const serializedTransaction = tx.serialize({disableMoreOutputThanInput: true});
        const response = await instance.methods.increment(
/*           (sigResponses: SignatureResponse[]) => {
            return findSig(sigResponses, bsv.PublicKey.fromString(pubKey))
          }, */
          serializedTransaction,
/*           {
            pubKeyOrAddrToSign: bsv.PublicKey.fromString(pubKey),
            changeAddress: address,
            next: {
              instance: nextInstance,
              balance: balance,
            },
          } as MethodCallOptions<TestCompile> */
          ) 
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Error:', error);
        }
      }
    };

    return (
      <button onClick={handleTestContract}>
        Test contract
      </button>
    );
  };
  
  export default TestContractButton;