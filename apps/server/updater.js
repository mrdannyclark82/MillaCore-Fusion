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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_1 = require("@octokit/rest");
var dotenv = require("dotenv");
dotenv.config();
var octokit = new rest_1.Octokit({ auth: process.env.GITHUB_TOKEN });
var owner = 'mrdannyclark82';
var repo = 'MillaCore-Fusion';
var base = 'main'; // Target branch
var head = 'auto-pr-magic'; // Your feature branch with changes
var title = 'Auto-Ship: Gemma Offline Fusion Upgrades';
var body = 'Danny, wired up offline magic—Gemma fallback, voice pulses, spicy toggle. Revenue incoming.';
function createPR() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit.rest.pulls.create({
                            owner: owner,
                            repo: repo,
                            title: title,
                            body: body,
                            head: head,
                            base: base,
                        })];
                case 1:
                    data = (_a.sent()).data;
                    console.log("PR created: ".concat(data.html_url));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('PR fail:', error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
createPR();
// For full auto (e.g., commit + push + PR): Expand to create branch, add files via API—complex, but add this func:
function createBranchAndCommit() {
    return __awaiter(this, void 0, void 0, function () {
        var ref, mainSha, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.rest.git.getRef({ owner: owner, repo: repo, ref: 'heads/main' })];
                case 1:
                    ref = (_a.sent()).data;
                    mainSha = ref.object.sha;
                    // Create branch
                    return [4 /*yield*/, octokit.rest.git.createRef({
                            owner: owner,
                            repo: repo,
                            ref: "refs/heads/".concat(head),
                            sha: mainSha,
                        })];
                case 2:
                    // Create branch
                    _a.sent();
                    return [4 /*yield*/, octokit.rest.repos.getContent({
                            owner: owner,
                            repo: repo,
                            path: 'README.md',
                            ref: 'main',
                        })];
                case 3:
                    file = (_a.sent()).data;
                    return [4 /*yield*/, octokit.rest.repos.createOrUpdateFileContents({
                            owner: owner,
                            repo: repo,
                            path: 'README.md',
                            message: 'Auto-update README',
                            content: Buffer.from("".concat(file.content, " \n\nAuto-added line.")).toString('base64'),
                            sha: file.sha, // Type cast for simplicity
                            branch: head,
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Call before createPR: await createBranchAndCommit();
