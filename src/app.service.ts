import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Backend Challenge 2021 🏅 - Covid Daily Cases';
  }
}
