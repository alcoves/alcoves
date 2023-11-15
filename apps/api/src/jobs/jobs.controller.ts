import { ApiTags } from '@nestjs/swagger'
import { JobsService } from './jobs.service'
import { Observable, fromEvent, map } from 'rxjs'
import { CreateJobDto } from './dto/create-job.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Controller, Get, Post, Body, Sse, MessageEvent } from '@nestjs/common'

@ApiTags('Jobs')
@Controller('api/jobs')
export class JobsController {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly jobsService: JobsService
  ) {}

  @Sse('/sse')
  sse(): Observable<{ data: any }> {
    return fromEvent(this.eventEmitter, 'job-update').pipe(
      map((data) => ({ data }))
    )
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto)
  }

  @Post('/clean')
  clean() {
    return this.jobsService.cleanQueues()
  }

  @Get()
  findAll() {
    return this.jobsService.findAll()
  }
}
