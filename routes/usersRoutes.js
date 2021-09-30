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
const pool = require("../database");
const bcrypt = require("bcryptjs");
const createToken = require("../utility/createToken");
const redis = require("redis");
const auth = require("../utility/auth");
const util = require("util");
const client = require("../utility/redisConnection");
// util.promisify(client.get).bind(client);
// util.promisify(client.set).bind(client);
const TIME = 3600;
// router.get("/", async (req: Request, res: Response) => {
//   try {
//    client.get("users",async (error:any,users:any)=>{
//     if(users!=null){
//       res.send(JSON.parse(users));
//     }else{
//       const users = await pool.query("SELECT id,username,email FROM Users");
//       client.set("users", JSON.stringify(users.rows));
//       res.send(users.rows );
//     }
//    });
//   } catch (error) {
//     console.log(error);
//   }
// });
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        client.get(`user-${id}`, (error, user) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(error);
            if (user !== null) {
                res.send(JSON.parse(user));
            }
            else {
                const user = yield pool.query("SELECT id,username,email FROM Users WHERE id=$1 ", [id]);
                client.set(`user-${user.rows[0].id}`, JSON.stringify(user.rows[0]));
                res.send(user.rows[0]);
            }
        }));
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const user = yield pool.query("INSERT INTO Users (username,email,password) VALUES ($1,$2,$3) RETURNING username,email", [username, email, hashedPassword]);
        const token = createToken(user.rows[0].id);
        res.send({ user: user.rows[0], token });
    }
    catch (error) {
        console.log(error);
    }
}));
router.put("/:id", [auth], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const id = req.params.id;
        const user = yield pool.query("UPDATE Users SET username=$1,email=$2,password=$3 WHERE id=$4 RETURNING *", [username, email, password, id]);
        res.send(user.rows);
    }
    catch (error) {
        console.log(error);
    }
}));
router.delete("/:id", [auth], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(typeof id);
        yield pool.query("DELETE FROM Users WHERE id=$1", [id]);
        res.send("Successfully deleted.");
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
