import * as opentelemetry from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

@Injectable()
export class TracingService implements OnModuleInit {
  private readonly logger = new Logger(TracingService.name);
  private readonly sdk: opentelemetry.NodeSDK | null;

  async onModuleInit() {
    const TRACER_ENDPOINT = process.env.TRACER_ENDPOINT;
    const shouldTrace = TRACER_ENDPOINT ? true : false;
    let sdk: opentelemetry.NodeSDK | null = null;

    if (shouldTrace) {
      this.logger.log('Enabling Tracing Functionality');
      this.logger.debug(`Traces will be sent to ${TRACER_ENDPOINT}`);

      const traceExporter = new OTLPTraceExporter({
        url: TRACER_ENDPOINT,
      });

      sdk = new opentelemetry.NodeSDK({
        traceExporter,
        instrumentations: [getNodeAutoInstrumentations()],
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'pier',
        }),
      });

      sdk.start();
    }
  }

  async enableShutdownHooks() {
    process.on('SIGTERM', () => {
      this?.sdk
        .shutdown()
        .then(() => this.logger.log('Tracing shutdown success'))
        .catch((error) =>
          this.logger.error('Error while terminating tracing', error),
        )
        .finally(() => process.exit(0));
    });
  }
}
