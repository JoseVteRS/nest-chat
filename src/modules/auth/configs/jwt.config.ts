import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configSetvice: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configSetvice.get('JWT_SECRET_KEY'),
  };
};
