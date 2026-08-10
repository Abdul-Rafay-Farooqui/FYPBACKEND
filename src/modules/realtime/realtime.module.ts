import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationParticipant, User, InstituteMember } from '../../entities';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ConversationParticipant, InstituteMember]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        secret: c.get('JWT_SECRET'),
        signOptions: { expiresIn: c.get('JWT_EXPIRES_IN', '30d') },
      }),
    }),
  ],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}