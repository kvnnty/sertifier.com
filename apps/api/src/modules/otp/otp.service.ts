import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { Model, Types } from 'mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  async generateOtp(
    userId: Types.ObjectId,
    purpose: Otp['purpose'],
    length = 5,
    ttlMinutes = 10,
  ): Promise<string> {
    await this.otpModel.deleteMany({
      userId,
      purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    const code = randomInt(10000, 100000).toString(); // 5-digit

    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.otpModel.create({
      userId,
      codeHash,
      purpose,
      expiresAt,
      used: false,
    });

    return code;
  }

  async validateOtp(
    userId: string,
    code: string,
    purpose: Otp['purpose'],
  ): Promise<boolean> {
    const otp = await this.otpModel.findOne({
      userId,
      purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) throw new BadRequestException('The code your entered is incorrect or expired');

    const isValid = await bcrypt.compare(code, otp.codeHash);
    if (!isValid) throw new BadRequestException('The code you entered is incorrect');

    otp.used = true;
    await otp.save();

    return true;
  }

  async clearAllForUser(userId: Types.ObjectId, purpose?: Otp['purpose']) {
    await this.otpModel.deleteMany({ userId, purpose });
  }
}
