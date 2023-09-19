"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransfer = void 0;
const pay_1 = require("@solana/pay");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
function validateTransfer(connection, signature, { recipient, amount, splToken, reference, memo }, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield connection.getTransaction(signature, options);
        console.log("Response: ", response);
        console.log("Response meta: ", response === null || response === void 0 ? void 0 : response.meta);
        if (!response)
            throw new pay_1.ValidateTransferError('not found');
        const { message, signatures } = response.transaction;
        const meta = response.meta;
        if (!meta)
            throw new pay_1.ValidateTransferError('missing meta');
        if (meta.err)
            throw meta.err;
        if (reference && !Array.isArray(reference)) {
            reference = [reference];
        }
        // Deserialize the transaction and make a copy of the instructions we're going to validate.
        const transaction = web3_js_1.Transaction.populate(message, signatures);
        const instructions = transaction.instructions.slice();
        // Transfer instruction must be the last instruction
        const instruction = instructions.pop();
        if (!instruction)
            throw new pay_1.ValidateTransferError('missing transfer instruction');
        console.log("spl token: ", splToken);
        const [preAmount, postAmount] = splToken
            ? yield validateSPLTokenTransfer(instruction, message, meta, recipient, splToken, reference)
            : yield validateSystemTransfer(instruction, message, meta, recipient, reference);
        console.log("Post amount: ", postAmount.toNumber());
        console.log("Pre amount: ", preAmount.toNumber());
        if (postAmount.minus(preAmount).lt(amount))
            throw new pay_1.ValidateTransferError('amount not transferred');
        // if (memo !== undefined) {
        //     // Memo instruction must be the second to last instruction
        //     const instruction = instructions.pop();
        //     if (!instruction) throw new ValidateTransferError('missing memo instruction');
        //     validateMemo(instruction, memo);
        // }
        return response;
    });
}
exports.validateTransfer = validateTransfer;
function validateSystemTransfer(instruction, message, meta, recipient, references) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("validate system transfer");
        const accountIndex = message.accountKeys.findIndex((pubkey) => pubkey.equals(recipient));
        if (accountIndex === -1)
            throw new pay_1.ValidateTransferError('recipient not found');
        if (references) {
            // Check that the instruction is a system transfer instruction.
            web3_js_1.SystemInstruction.decodeTransfer(instruction);
            // Check that the expected reference keys exactly match the extra keys provided to the instruction.
            const [_from, _to, ...extraKeys] = instruction.keys;
            const length = extraKeys.length;
            if (length !== references.length)
                throw new pay_1.ValidateTransferError('invalid references');
            for (let i = 0; i < length; i++) {
                if (!extraKeys[i].pubkey.equals(references[i]))
                    throw new pay_1.ValidateTransferError(`invalid reference ${i}`);
            }
        }
        return [
            new bignumber_js_1.default(meta.preBalances[accountIndex] || 0).div(web3_js_1.LAMPORTS_PER_SOL),
            new bignumber_js_1.default(meta.postBalances[accountIndex] || 0).div(web3_js_1.LAMPORTS_PER_SOL),
        ];
    });
}
function validateSPLTokenTransfer(instruction, message, meta, recipient, splToken, references) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Validate Spl transfer");
        const recipientATA = yield (0, spl_token_1.getAssociatedTokenAddress)(splToken, recipient);
        console.log("recipient ATA: ", recipientATA);
        const accountIndex = message.accountKeys.findIndex((pubkey) => pubkey.equals(recipientATA));
        if (accountIndex === -1)
            throw new pay_1.ValidateTransferError('recipient not found');
        if (references) {
            // Check that the first instruction is an SPL token transfer instruction.
            const decodedInstruction = (0, spl_token_1.decodeInstruction)(instruction);
            if (!(0, spl_token_1.isTransferCheckedInstruction)(decodedInstruction) && !(0, spl_token_1.isTransferInstruction)(decodedInstruction))
                throw new pay_1.ValidateTransferError('invalid transfer');
            // Check that the expected reference keys exactly match the extra keys provided to the instruction.
            const extraKeys = decodedInstruction.keys.multiSigners;
            const length = extraKeys.length;
            if (length !== references.length)
                throw new pay_1.ValidateTransferError('invalid references');
            for (let i = 0; i < length; i++) {
                if (!extraKeys[i].pubkey.equals(references[i]))
                    throw new pay_1.ValidateTransferError(`invalid reference ${i}`);
            }
        }
        const preBalance = (_a = meta.preTokenBalances) === null || _a === void 0 ? void 0 : _a.find((x) => x.accountIndex === accountIndex);
        const postBalance = (_b = meta.postTokenBalances) === null || _b === void 0 ? void 0 : _b.find((x) => x.accountIndex === accountIndex);
        return [
            new bignumber_js_1.default((preBalance === null || preBalance === void 0 ? void 0 : preBalance.uiTokenAmount.uiAmountString) || 0),
            new bignumber_js_1.default((postBalance === null || postBalance === void 0 ? void 0 : postBalance.uiTokenAmount.uiAmountString) || 0),
        ];
    });
}
