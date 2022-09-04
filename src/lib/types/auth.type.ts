export interface Auth {
	username: string;
	email: string;
	scp: string[];
	sub: string;
	id: string;
	iat: number;
	exp: number;
	token: string;
}
