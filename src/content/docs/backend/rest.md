---
title: REST API
description: Core principles, HTTP methods, status codes, and OpenAPI/Swagger.
cheatsheet:
  slug: rest
  section: backend
  summary: A cheat sheet for REST API principles, methods, and OpenAPI.
  topicVersion: "N/A"
  verifiedAgainst:
    - label: REST Architectural Style
      url: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
  lastVerified: 2026-08-01
  difficulty: beginner
  tags: [rest, api, http, openapi, swagger]
---

## Mental model

REST (Representational State Transfer) is an architectural style for
designing networked applications. It treats data and functionality as
resources accessed via standard HTTP methods. Clients and servers are
decoupled, meaning the server does not store client state between
requests.

## HTTP methods

| Method | Purpose | Idempotent |
|---|---|---|
| `GET` | Read a resource | Yes |
| `POST` | Create a resource | No |
| `PUT` | Replace a resource | Yes |
| `PATCH` | Modify a resource | No |
| `DELETE` | Delete a resource | Yes |

Methods map to CRUD operations on resources. Idempotent methods
produce the same result whether called once or multiple times, which
is crucial for safe retries.

```http
POST /users HTTP/1.1
Content-Type: application/json

{"name": "Alice"}
```

> **Gotcha:** `PUT` replaces the entire resource. If you only send
> one field in a `PUT` request, the server should typically nullify
> the missing fields. Use `PATCH` for partial updates.

## Resource URLs

| Pattern | Usage |
|---|---|
| `/users` | Collection of users |
| `/users/123` | Specific user |
| `/users/123/orders` | Orders for a user |

URLs should identify resources (nouns), not actions (verbs). Hierarchy
indicates relationships.

```http
GET /users/123/orders HTTP/1.1
Accept: application/json
```

> **Tip:** Keep URLs predictable. Avoid nested URLs deeper than two
> levels (e.g., `/users/1/orders/2/items`); instead, use the direct
> resource if possible.

## Status codes

| Range | Meaning | Common Examples |
|---|---|---|
| `2xx` | Success | `200`, `201`, `204` |
| `4xx` | Client Error | `400`, `401`, `403`, `404` |
| `5xx` | Server Error | `500`, `502`, `503`, `504` |

Status codes tell the client how the server processed the request.
They divide responsibilities: `4xx` means the client must change the
request, `5xx` means the server failed.

> **Gotcha:** Returning `200 OK` with an error message in the body
> defeats standard HTTP caching and makes debugging harder for
> API consumers. Use appropriate error codes instead.

## OpenAPI and Swagger

| Term | Description |
|---|---|
| OpenAPI | The specification standard (YAML/JSON) |
| Swagger | Tooling ecosystem (UI, codegen) |

OpenAPI is a formal specification for describing REST APIs. It defines
endpoints, request shapes, and responses in a machine-readable format.
Swagger refers to tools that implement this spec.

```yaml
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: A list of users
```

> **Note:** "Swagger spec" was renamed to "OpenAPI spec" in 2016.
> Today, you write OpenAPI documents and visualize them with tools
> like Swagger UI.

## Further reading

- [Roy Fielding's Dissertation](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [OpenAPI Specification](https://swagger.io/specification/)
