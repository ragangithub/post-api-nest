import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import ProfileDto from './dto/createProfile.dto'

import UpdateProfileDto from './dto/updateProfile.dto'

@Injectable()
export default class ProfileService {
  constructor(private prisma: PrismaService) {}

  async post(dto: ProfileDto) {
    const newProfile = await this.prisma.profile.create({
      data: {
        image: dto.image,
        location: dto.location,
        bio: dto.bio,
        user: {
          connect: { id: Number(dto.userId) },
        },
      },
    })

    return newProfile
  }

  async deleteProfile(profileId: number, incomingId: number) {
    // const profile = await this.prisma.profile.findUnique({
    //   where: { id: profileId },
    // })
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
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      )
    }

    await this.prisma.profile.delete({
      where: { id: profileId },
    })

    return { message: 'Profile deleted successfully' }
  }

  async updateProfile(
    profileId: number,
    dto: UpdateProfileDto,
    incomingId: number,
  ) {
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
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      )
    }

    interface UpdateData {
      image?: string
      location?: string
      bio?: string
    }

    const updateData: UpdateData = {}

    if (dto.image) {
      updateData.image = dto.image
    }
    if (dto.location) {
      updateData.location = dto.location
    }
    if (dto.bio) {
      updateData.bio = dto.bio
    }

    return this.prisma.profile.update({
      where: { id: profileId },
      data: updateData,
    })
  }
}
