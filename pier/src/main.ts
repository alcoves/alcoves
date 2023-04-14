import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get("PORT") || 4000;

	app.enableCors({
		origin: "*",
		credentials: false,
	});

	const config = new DocumentBuilder()
		.setTitle("Pier API")
		.setDescription("The API for Reef")
		.setVersion("0.1")
		.addTag("alcoves")
		.addBearerAuth()
		.setExternalDoc("Postman Collection", "/api-json")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(port);
}
bootstrap();
