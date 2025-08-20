import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { IdResolverService } from '../common/id-resolver.service';

@Controller('streams')
export class StreamsController {
  constructor(
    private readonly streams: StreamsService,
    private readonly resolver: IdResolverService,
  ) {}

  @Get(':type/:id')
  async byId(@Param('type') type: string, @Param('id') id: string) {
    const t = type === 'movie' ? 'movie' : (type === 'series' || type === 'tv') ? 'series' : null;
    if (!t) throw new BadRequestException('type must be movie or series');

    const imdb = await this.resolver.toImdbId(t, id);
    return this.streams.getStreams(t, imdb);
  }
}
