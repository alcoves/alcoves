import * as dotenv from 'dotenv';
dotenv.config();

import * as opentelemetry from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

const TRACING_ENDPOINT = process.env.TRACING_ENDPOINT;
let sdk: opentelemetry.NodeSDK | null = null;

if (TRACING_ENDPOINT) {
  sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: TRACING_ENDPOINT,
    }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new NestInstrumentation(),
      new PrismaInstrumentation({ middleware: true }),
    ],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'pier',
    }),
  });
}

process.on('SIGTERM', () => {
  sdk
    ? sdk
        .shutdown()
        .then()
        .catch()
        .finally(() => process.exit(0))
    : null;
});

export default sdk;
