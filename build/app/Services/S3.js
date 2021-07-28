"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const endpoint = new aws_sdk_1.default.Endpoint(`${Env_1.default.get('STORAGE_ENDPOINT')}`);
const s3 = new aws_sdk_1.default.S3({
    endpoint: endpoint,
    credentials: new aws_sdk_1.default.Credentials(`${Env_1.default.get('STORAGE_ACCESS_KEY_ID')}`, `${Env_1.default.get('STORAGE_ACCESS_SECRET_KEY')}`),
});
class S3Service {
    async upload(file, filename, ContentType, folder, privacidade) {
        return await new Promise((resolve, reject) => {
            s3.upload({
                Bucket: `${Env_1.default.get('STORAGE_BUCKET')}/${folder}`,
                ContentType,
                Body: file,
                ACL: privacidade,
                Key: filename,
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(`https://calebe.nyc3.cdn.digitaloceanspaces.com/${data.Key}`);
            });
        });
    }
}
exports.default = new S3Service();
//# sourceMappingURL=S3.js.map