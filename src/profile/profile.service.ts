import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import ProfileDto from './dto/createProfile.dto'

import UpdateProfileDto from './dto/updateProfile.dto'
import ProfileUpdateType from './types/profile'

@Injectable()
export default class ProfileService {
  constructor(private prisma: PrismaService) {}

  async post(dto: ProfileDto, incomingId: number) {
    const newProfile = await this.prisma.profile.create({
      data: {
        image: dto.image,
        location: dto.location,
        bio: dto.bio,
        user: {
          connect: { id: Number(incomingId) },
        },
      },
    })

    return newProfile
  }

  async deleteProfile(profileId: number, incomingId: number) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          user: true,
        },
      })

      if (!profile) {
        throw new NotFoundException('Profile not found')
      }

      if (profile.user.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to delete this profile')
      }

      await this.prisma.profile.delete({
        where: { id: profileId },
      })

      return { message: 'Profile deleted successfully' }
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while deleting the profile')
      }
    }
  }

  async updateProfile(
    profileId: number,
    dto: UpdateProfileDto,
    incomingId: number,
  ) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          user: true,
        },
      })

      if (!profile) {
        throw new NotFoundException('Profile not found')
      }

      if (profile.user.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to update this post')
      }

      const updateData: ProfileUpdateType = {}

      if (dto.image) {
        updateData.image = dto.image
      }
      if (dto.location) {
        updateData.location = dto.location
      }
      if (dto.bio) {
        updateData.bio = dto.bio
      }

      return await this.prisma.profile.update({
        where: { id: profileId },
        data: updateData,
      })
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while updating the profile')
      }
    }
  }
}
