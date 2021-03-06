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
const google_auth_library_1 = require("google-auth-library");
const pool = require("../database");
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
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
                res.send({ token, id: user.rows[0].id });
            }
            else {
                res.send({ message: "Wrong username or password." });
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
router.post("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        console.log(tokenId);
        client
            .verifyIdToken({ idToken: tokenId, audience: process.env.CLIENT_ID })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                const user = yield pool.query("SELECT * FROM Users WHERE email=$1", [
                    email,
                ]);
                if (user.rows.length === 0) {
                    const salt = yield bcrypt.genSalt(10);
                    const joinedPass = email + process.env.SECRET_KEY_FOR_LOGIN;
                    const password = yield bcrypt.hash(joinedPass, salt);
                    try {
                        const user = yield pool.query("INSERT INTO Users (username,email,password) VALUES ($1,$2,$3) RETURNING *", [name, email, password]);
                        const token = createToken(user.rows[0].id);
                        res.send({ token });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    const token = createToken(user.rows[0].id);
                    res.send({ token, id: user.rows[0].id });
                }
            }
        }))
            .catch((error) => {
            console.log(error);
            res.send(error);
        });
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
