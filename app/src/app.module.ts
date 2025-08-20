import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SearchController } from './search/search.controller';
import { StreamsController } from './streams/streams.controller';
import { StreamsService } from './streams/streams.service';
import { IdResolverService } from './common/id-resolver.service';

@Module({
  imports: [],
  controllers: [HealthController, SearchController, StreamsController],
  providers: [StreamsService, IdResolverService],
})
export class AppModule {}
