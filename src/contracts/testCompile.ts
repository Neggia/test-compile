import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    SigHash,
    hash160,
    toByteString,
    abs
} from 'scrypt-ts'
import testCompileJSON from '../../artifacts/testCompile.json';
import type {ByteString} from 'scrypt-ts';

export class TestCompile extends SmartContract {
    static readonly SCRIPT_HEX = testCompileJSON.hex
    static readonly SCRIPT_HEX_SEP = '-'
    static readonly SCRIPT_HEX_SPLIT = TestCompile.SCRIPT_HEX.replace('<count>', TestCompile.SCRIPT_HEX_SEP);
    static readonly SCRIPT_HEX_CHUNK_01 = TestCompile.SCRIPT_HEX_SPLIT.slice(0, TestCompile.SCRIPT_HEX_SPLIT.indexOf(TestCompile.SCRIPT_HEX_SEP))
    static readonly SCRIPT_HEX_CHUNK_02 = TestCompile.SCRIPT_HEX_SPLIT.slice(TestCompile.SCRIPT_HEX_CHUNK_01.length + TestCompile.SCRIPT_HEX_SEP.length)
    static readonly SCRIPT_HEX_CHUNK_01_LEN = BigInt(TestCompile.SCRIPT_HEX_CHUNK_01.length)
    static readonly SCRIPT_HEX_CHUNK_02_LEN = BigInt(TestCompile.SCRIPT_HEX_CHUNK_02.length)
    static readonly SCRIPT_HEX_CHUNK_01_HASH160 = hash160(TestCompile.SCRIPT_HEX_CHUNK_01)

    static readonly DIV_PRECISION_TOLERANCE = 100000n

    @prop(true)
    count: bigint

    constructor(count: bigint) {
        super(count)
        this.count = count
    }

    @method(SigHash.SINGLE)
    public increment(
        prevTxRaw: ByteString,
    ) {
        this.count++

        // Why the following istrunctions can't compile?
        const scriptHexChunk01 = prevTxRaw.slice(0,Number(TestCompile.SCRIPT_HEX_CHUNK_01_LEN)) // Can't compile
        let test = toByteString('0123') // Compile
        test +=  toByteString('0123') // Compile
        test += TestCompile.SCRIPT_HEX_CHUNK_01 // Can't compile
        const delta = abs(1n - 2n) // Ok
        console.log('delta: ', delta) // Ok
        assert( BigInt(delta) < BigInt(TestCompile.DIV_PRECISION_TOLERANCE), "Incorrect token amount") // Ok

        // make sure balance in the contract does not change
/*         const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch') */
    }
}
