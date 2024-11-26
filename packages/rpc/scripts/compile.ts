import * as os from 'os';
import * as child_process from "child_process"
import * as fs from 'fs';

fs.mkdirSync(__dirname + '/dist', {recursive: true})

let pluginOption = "";
if(os.platform() === "win32") {
    pluginOption = "protoc-gen-ts_proto=\"..\\..\\node_modules\\.bin\\protoc-gen-ts_proto.cmd\""
} else {
    pluginOption = "../../node_modules/.bin/protoc-gen-ts_proto"
}

const cmd = `protoc --plugin=${pluginOption} --proto_path=./src --ts_proto_out=. ./src/service.proto`

const proc = child_process.spawn(cmd)
proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)

proc.on('close', (code: number) => {
    console.log(`Process exited with code ${code}`)
})
