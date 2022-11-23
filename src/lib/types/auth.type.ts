export interface Auth {
	avatar: string;
	username: string;
	email: string;
	scp: string[];
	sub: string;
	id: string;
	iat: number;
	exp: number;
	token: string;
	social: string;
	socialToken: string;
}
