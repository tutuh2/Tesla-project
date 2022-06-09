import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';

interface IFile {
    files: FileUpload[];
}

@Injectable()
export class FileService {
    async upload({ files }: IFile) {
        const storage = new Storage({
            projectId: 'backend02',
            keyFilename: 'gcp-file-storage.json',
        }).bucket('thumb-codecamp-storage13');

        //일단 먼저 다 받기
        const waitedFiles = await Promise.all(files);

        const results = await Promise.all(
            waitedFiles.map((el) => {
                return new Promise((resolve, reject) => {
                    el.createReadStream()
                        .pipe(storage.file(el.filename).createWriteStream())
                        .on('finish', () =>
                            resolve(
                                `https://storage.googleapis.com/thumb-codecamp-storage13/${el.filename}`,
                            ),
                        )
                        .on('error', () => reject());
                });
            }),
        );
        // 파일을 읽어옴
        console.log('파일 업로드 완료!');
        return results;
    }
}
