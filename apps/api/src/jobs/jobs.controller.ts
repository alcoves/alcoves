import { ApiTags } from '@nestjs/swagger'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { Controller, Get, Post, Body } from '@nestjs/common'

@ApiTags('Jobs')
@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto)
  }

  @Post('/test')
  createTestJob() {
    return this.jobsService.createTestJob()
  }

  @Post('/clean')
  clean() {
    return this.jobsService.cleanQueue()
  }

  @Get()
  findAll() {
    return this.jobsService.findAll()
  }
}
