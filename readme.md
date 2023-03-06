## How to setup the project

1. yarn
2. yarn prisma:generate
3. yarn dev

## Initial setup
Project has one query that allow to fetch user by it's ID and one mutation that allow user to create a new user. You don't need to setup any database since it currently use SQLite. Please read prisma quick start(5 min) if you haven't used it before. It allow you to manage database schema and migration and can we used as database ORM level.

## Task Goals
1. Add a mutation that will expose a Graphql endpoint that will allow to create a new product in database
2. Add error handling by using zod(https://github.com/colinhacks/zod)
- Unfortunately, I’m not sure that I realized where I should apply Zod.
3. Add a mutation that will make make listing active. Assume that it is the most simple way to review this listing
4. Add query that will allow to fetch a list of listings with pagination, filters and search
5. Add a simple viewer query that will allow user to see it's profile and all owned listings by passing userId request header
6. (Optional) Add user role(ADMIN, USER). Admins can see all listings, users can only see listings in active status
7. (Optional) Implement a same search/filters query by using Elastic search. Add a configuration flat that will allow the backend to switch between elastic/sqllite

## Useful links
 - https://www.prisma.io
 - https://nexusjs.org

## Elasticsearch instance(basic auth)
https://uk.es-dev.byrotation.com/
integration
_9dkAWmNEYeWNeAjEtXk_22JgHxCdHk