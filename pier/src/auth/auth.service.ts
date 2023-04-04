import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService, private usersService: UsersService) {}

	async login(user: User): Promise<{ access_token: string }> {
		return {
			access_token: this.jwtService.sign(
				{
					sub: user.id,
					email: user.email,
				},
				{
					secret: process.env.JWT_SECRET,
				},
			),
		};
	}

	async register({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}): Promise<{ access_token: string }> {
		const hashedPassword = await this.hashPassword(password);
		const user = await this.usersService.createOne({
			email,
			username,
			password: hashedPassword,
		});

		return this.login(user);
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.usersService.findByEmail(email);
		if (!user) return null;

		const passwordMatched = await this.comparePasswords(password, user.password);
		if (passwordMatched) return user;
		return null;
	}

	hashPassword(password: string) {
		return bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
	}

	comparePasswords(password: string, hashedPassword: string) {
		return bcrypt.compare(password, hashedPassword);
	}
}
