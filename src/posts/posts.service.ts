import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) { }

  async createPost(
    dto: CreatePostDto,
    uploaderId: string,
    resources?: Express.Multer.File[],
  ): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        userId: uploaderId,
        communityId: dto.communityId,
        ongId: dto.ongId,
      },
    });

    if (resources?.length) {
      const resourceData = resources.map((file) => ({
        title: file.originalname,
        type: this.detectType(file.mimetype),
        url: `/uploads/resources/${file.filename}`,
        postId: post.id,
        uploaderId,
        communityId: post.communityId
      }));

      await this.prisma.resource.createMany({ data: resourceData });
    }

    return post;
  }

  private detectType(mime: string): string {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime === 'application/pdf') return 'pdf';
    return 'other';
  }

  getPostByCommunityId(id: string) {
    return this.prisma.post.findMany({
      where: {
        communityId: id,
      },
      include: {
        resources: true,
        user: true,
        likes: {
          include: {
            user: true
          }
        },
        comments: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findByOng(
    ongId: string
  ) {
    return this.prisma.post.findMany({
      where: {
        ongId: ongId,
      },
      include: {
        user: true,
        community: true,
        ong: true,
        resources: true,
        views: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findALL(

  ) {
    return this.prisma.post.findMany({

      include: {
        user: true,
        community: true,
        ong: true,
        resources: true,
        views: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  findByCommunity(
    communityId: string
  ) {
    return this.prisma.post.findMany({
      where: {
        communityId: communityId,
      },
      include: {
        user: true,
        community: true,
        ong: true,
        resources: true,
        views: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  async findAll() {    
    return this.prisma.post.findMany({    
      include: {
        user: true,
        community: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        },
        ong: true,
        resources: true,
        views: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }




  getPostsWithResourcesByCommunity( communityId: string ) {


    

    return this.prisma.post.findMany({
      where: {
        communityId: communityId,
        resources: {
          some: {},
        },
      },
      include: {
        user: true,
        community: true,
        ong: true,
        resources: true,
        views: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        shares: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });


  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
