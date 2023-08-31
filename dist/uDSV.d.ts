type DeepReadonly<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}

export interface InferSchemaOpts {
	/** should return an array whose length is how many header rows to skip, and should include an UntypedRow to use for col names */
	header?: (rows: string[]) => (string[] | null)[]; // default: rows => [rows[0]]

	/** column delimiter (null = infer, ',' = comma) */
	col?:  string | null;  // null (infers from header in this order: [tab, pipe, semi, comma])

	/** row delimiter (null = infer, '\n' = unix LF) */
	row?:  string | null;  // null (infers from header in this order: [\r\n, \r, \n])

	/** column enclosure (null = infer, '' = none, '"' = quote) */
	encl?: string | null;  // null (infers from presence of '"' in whole csvStr)

	/** column enclosure escape (null = same as encl, '\\' = custom) */
	esc?:  string | null;  // null

	/** trim values (excludes within quotes) */
	trim?: boolean;        // false

	// #comments and empty lines (ignore:), needs callback for empty and comments?
//	omit?,
}

export const enum SchemaColumnType {
	String       = 's',
	Number       = 'n',
	Date         = 'd',
	JSON         = 'j',
	Boolean_1    = 'b:1',
	Boolean_t    = 'b:t',
	Boolean_T    = 'b:T',
	Boolean_true = 'b:true',
	Boolean_True = 'b:True',
	Boolean_TRUE = 'b:TRUE',
	Boolean_y    = 'b:y',
	Boolean_Y    = 'b:Y',
	Boolean_yes  = 'b:yes',
	Boolean_Yes  = 'b:Yes',
	Boolean_YES  = 'b:YES',
}

export interface SchemaColumn {
	/** column name */
	name: string;

	/** data type */
	type: SchemaColumnType;

	/** special value replacements (undefined = don't replace) */
	repl: {
		/** empty strings */
		empty: any;  // null

		/** 'null' strings */
		null: any;   // undefined

		/** 'NaN' strings (only applies when type: number) */
		NaN: any;    // undefined
	};
}

export interface Schema {
	/** column delimiter */
	col:    string;

	/** row delimiter */
	row:    string;

	/** column enclosure */
	encl:   string;

	/** column enclosure escape */
	esc:    string;

	/** trim values (excludes within quotes) */
	trim:   boolean;

	/** column defs */
	cols: SchemaColumn[],
}

/** can return false to stop further parsing */
export type OnDataFn<T> = (
	/** parsed rows or cols */
	data: T[],
	/** appender (for internal buffer) */
	append: (data: T[]) => void
) => void | false; // | T[];

export type BaseParse<T> = (csvStr: string, onData?: OnDataFn<T>) => T[];

type record = Record<string, unknown>;

export interface Parser {
	/** exposed schema */
	readonly schema: DeepReadonly<Schema>;

	// readonly buffer:

	/** parses to string tuples */
	stringArrs: <T extends string[]  = []>(csvStr: string, onData?: OnDataFn<T>) => T[]; // ReturnType<OnDataFn<T>>

	/** parses to typed tuples */
	typedArrs:  <T extends unknown[] = []>(csvStr: string, onData?: OnDataFn<T>) => T[];

	/** parses to typed objects */
	typedObjs:  <T extends record    = {}>(csvStr: string, onData?: OnDataFn<T>) => T[];

	/** parses to nested typed objects (using column names) */
	typedDeep:  <T extends record    = {}>(csvStr: string, onData?: OnDataFn<T>) => T[];

	/** parses to typed columnar arrays */
	typedCols:  <T extends unknown[] = []>(csvStr: string, onData?: OnDataFn<T>) => T[];

	/**
	 * starts or continues incremental parsing \
	 * default parse = stringArrs, default onData = accumulator
	 **/
	chunk: <T>(csvStr: string, parse?: BaseParse<T>, onData?: OnDataFn<T>) => void;

	/** stops and resets incremental parsing */
	end: <T>() => T[];
}

/** guesses a schema from input */
export function inferSchema(
	/** full csv or initial chunk */
	csvStr: string,

	/** pre-defined / partial schema */
	opts?: InferSchemaOpts,

	/** analysis limit (default: 10) */
	maxRows?: number,
): Schema;

export function initParser(
	/** inferred or manually defined schema */
	schema: Schema,

	/** how many parsed items to accumulate for onData (default = 1e3) */
	chunkSize?: number,
): Parser;
