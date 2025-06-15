export type Link = {
	slug: string;
	url: string;
	description?: string;
	is_enabled: boolean;
	created_at: string;
	last_visited_at?: string | null;
	visit_count: number;
};

export type ApiLink = {
	short_code: string;
	original_url: string;
	description: string | null;
	is_enabled: number;
	created_at: string;
	last_visited_at: string | null;
	visit_count: number;
};

export type CreateLinkResponse = {
	message: string;
	short_code: string;
	short_url: string;
	original_url: string;
};

export type FormState = {
	message: string;
	error?: boolean;
	fieldErrors?: {
		url?: string[];
		slug?: string[];
		description?: string[];
		_root?: string[];
	};
};
