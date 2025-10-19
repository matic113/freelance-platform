# Agents Guidelines

## Frontend (React/TypeScript/Vite)
**Build/Test Commands:**
- `cd frontend && pnpm install` - Install dependencies
- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint (no test runner configured)

**Code Style:**
- **Imports:** Organize by: React/third-party libs → internal services/types → UI components (e.g., `import React from 'react'; import axios from 'axios'; import { api } from '@/services/api'; import { Button } from '@/components/ui/button';`)
- **Naming:** PascalCase for components/interfaces, camelCase for variables/functions, .service.ts for API services, use-* for custom hooks
- **Types:** Define in `src/types/` (api.ts, contract.ts); use Zod schemas; `React.FC<Props>` for components; no strict null checks (`strictNullChecks: false`)
- **Error Handling:** Use `try-catch` in services with Promise.reject(); toast errors with `sonner` library; handle axios errors via interceptors in api.ts
- **State:** React hooks (useState, useContext), TanStack Query for server state, custom hooks in `src/hooks/`, path alias `@/*` for imports

## Backend (Java/Spring Boot 3.5.6)
**Build/Test Commands:**
- `cd backend && ./mvnw clean install` - Full build with tests
- `./mvnw spring-boot:run` - Run application and test for compilation

**Code Style:**
- **Imports:** Organize alphabetically by package; Spring/Java libs first → then application packages (com.freelance.platform.*)
- **Naming:** PascalCase for classes, camelCase for methods/fields, @RestController for endpoints, DTO suffix for DTOs, Service suffix for services
- **Types:** Use strong typing with generics; DTOs for requests/responses; @Value for config injection; Java 17 features allowed
- **Error Handling:** Custom exceptions extending RuntimeException; @ExceptionHandler in controllers; wrap in ResponseEntity with proper HTTP status
- **Controllers:** @RestController, @RequestMapping, @PreAuthorize for security, @PageableDefault for pagination, @Operation/@Tag for Swagger docs

## Shared
- **Git:** No uncommitted changes before starting; stage only relevant files; meaningful commit messages
- **Secrets:** Never commit API keys, tokens, or credentials; use environment variables
