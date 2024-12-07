import * as os from 'os';
import * as child_process from "child_process"
import * as fs from 'fs';

fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist', {recursive: true})

let pluginOption: string;
if(os.platform() === "win32") {
    pluginOption = "protoc-gen-ts_proto=\"..\\\\..\\\\node_modules\\\\.bin\\\\protoc-gen-ts_proto.cmd\""
} else {
    pluginOption = "../../node_modules/.bin/protoc-gen-ts_proto"
}

const cmd = `protoc --plugin=${pluginOption} --proto_path=./src/protos --ts_proto_out=./dist ./src/protos/*.proto`

const proc = child_process.exec(cmd)
proc.stdout?.on('data', (data: Buffer) => {
    console.log(data.toString())
})
proc.stderr?.on('data', (data: Buffer) => {
    console.error(data.toString())
})
proc.on('close', (code: number) => {
    console.log(`Process exited with code ${code}`)
})

fs.cpSync('./LICENSE', './dist/LICENSE')
fs.cpSync('./src/protos', './dist/protos/', {recursive: true})
