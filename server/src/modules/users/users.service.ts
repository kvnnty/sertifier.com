import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { OrganizationsService } from '../organizations/organizations.service';
import { UpdateUserDto, UserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private organizationsService: OrganizationsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createNewUser(newUser: UserDto) {
    const existingUser = await this.userModel.findOne({
      email: newUser.email,
    });

    if (existingUser) {
      throw new ConflictException(
        'This email is already in use. Try another or log in.',
      );
    }

    const { password, ...rest } = newUser;

    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;

    const savedUser = await new this.userModel({
      ...rest,
      passwordHash,
      preferences: {
        emailNotifications: true,
        language: 'en',
        timezone: 'UTC',
      },
    }).save();

    // Automatically create an organization for the user
    await this.organizationsService.create({
      name: `${savedUser.firstName}'s Organization`,
      contactInfo: { email: savedUser.email },
      createdBy: savedUser.id,
    });

    return savedUser;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ users: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({ isVerified: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments({ isVerified: true }),
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('This account does not exist');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundException('This account does not exist');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isVerified: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('This account does not exist');
    }
  }

  async updatePassword(userId: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    await this.userModel.findByIdAndUpdate(userId, { passwordHash });
  }

  async markEmailAsVerified(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
      { new: true },
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
  }
}
