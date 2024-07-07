import { SetMetadata } from '@nestjs/common';

export const EXCLUDE_FROM_AUTH_KEY = 'isPublic';
export const ExcludeFromAuth = () => SetMetadata(EXCLUDE_FROM_AUTH_KEY, true);
