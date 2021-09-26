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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcrypt = require("bcryptjs");
const createToken = require("../utility/createToken");
const pool = require("../database");
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield pool.query("SELECT * FROM Users WHERE email=$1", [
            email,
        ]);
        if (user.rows.length !== 0) {
            const passwordCorrect = yield bcrypt.compare(password, user.rows[0].password);
            if (passwordCorrect) {
                const token = createToken(user.rows[0].id);
                res.send({ token });
            }
            else {
                res.status(404).send({ message: "Wrong username or password." });
            }
        }
        else {
            res.status(404).send({ message: "Wrong username or password." });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
