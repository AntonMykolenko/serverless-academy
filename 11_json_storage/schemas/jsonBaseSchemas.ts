import { pgTable, text } from 'drizzle-orm/pg-core';

export type JsonBaseData = {
    name: string,
    json: string
}

export const jsonbase = pgTable('jsonbase',{
    name:text('name').notNull().unique(), 
    json:text('json').notNull()
});