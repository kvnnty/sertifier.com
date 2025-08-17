import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRService {
  generateQR(credentialId: string): Promise<string> {
    const verificationUrl = `${process.env.APP_URL}/verify/${credentialId}`;

    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        verificationUrl,
        // {
        //   errorCorrectionLevel: 'M',
        //   type: 'image/png',
        //   quality: 0.92,
        //   margin: 1,
        //   color: {
        //     dark: '#000000',
        //     light: '#FFFFFF',
        //   },
        // },
        (err, url) => {
          if (err) {
            return reject(
              new InternalServerErrorException('Failed to generate QR code'),
            );
          }
          resolve(url);
        },
      );
    });
  }
}
