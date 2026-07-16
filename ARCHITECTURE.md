# Architecture Technique - Tableau de Risques de Contamination

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    ArcGIS Experience Builder             │
│                  (Integration Container)                 │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
    ┌────▼─────────────────────────┐    │
    │   React Application (Vite)   │    │
    │ ┌──────────────────────────┐ │    │
    │ │  UI Components (Shadcn)  │ │    │
    │ │  - RiskTable             │ │    │
    │ │  - FilterPanel           │ │    │
    │ │  - ComparisonView        │ │    │
    │ └──────────────────────────┘ │    │
    │ ┌──────────────────────────┐ │    │
    │ │  State Management        │ │    │
    │ │  - Zustand (Global)      │ │    │
    │ │  - React Query (Server)  │ │    │
    │ └──────────────────────────┘ │    │
    │ ┌──────────────────────────┐ │    │
    │ │  Styling                 │ │    │
    │ │  - Tailwind CSS          │ │    │
    │ │  - Theme System          │ │    │
    │ └──────────────────────────┘ │    │
    └────────┬─────────────────────┘    │
             │                          │
    ┌────────▼──────────┐               │
    │  REST APIs        │               │
    │  - Risks API      │──────────────┤
    │  - Weather API    │               │
    │  - Models API     │               │
    │  - ArcGIS API     │               │
    └─────────────────────┘
```

---

## 2. Stack technologique

### 2.1 Frontend

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|----------------|
| **React** | 18.3+ | Framework UI | Standard industrie, composants déclaratifs |
| **TypeScript** | 5.3+ | Type safety | Évite bugs, améliore maintenabilité |
| **Vite** | 5.0+ | Build tool | Rapide, moderne, remplace Create React App |
| **Tailwind CSS** | 3.3+ | Styling | Utility-first, responsive, performant |
| **Shadcn/UI** | Latest | Component library | Composants accessibles, personnalisables |
| **React Query** | 5.0+ | Server state | Caching, sync, mutations API |
| **Zustand** | 4.4+ | Global state | Léger, facile, pas boilerplate |
| **React Table** | 8.0+ | Data table | Headless, flexible, performant |
| **Recharts** | 2.10+ | Charting | React-native, responsive, simple |
| **Zod** | 3.22+ | Validation | TypeScript-first, runtime checks |
| **date-fns** | 3.0+ | Date utils | Immutable, tree-shakeable |

### 2.2 Testing

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|----------------|
| **Vitest** | 1.0+ | Unit tests | Vite-native, rapide, compatible Jest |
| **React Testing Library** | 14.0+ | Component tests | Best practices (behavior not impl) |
| **Playwright** | 1.40+ | E2E tests | Cross-browser, rapide, reliable |
| **@testing-library/user-event** | 14.5+ | User simulation | Better than fireEvent |

### 2.3 Développement

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|----------------|
| **ESLint** | 8.50+ | Linting | Code quality, bugs prevention |
| **Prettier** | 3.0+ | Formatting | Consistent code style |
| **Husky** | 8.0+ | Git hooks | Pre-commit checks |
| **lint-staged** | 15.0+ | Staged linting | Lint seulement fichiers modifiés |

### 2.4 ArcGIS Integration

| Technologie | Version | Rôle | Justification |
|-------------|---------|------|----------------|
| **ArcGIS API for JS** | 4.28+ | Maps & data | Native ArcGIS integration |
| **@arcgis/core** | 4.28+ | Core library | Moderne, modules, type-safe |

---

## 3. Structure du projet

```
src/
├── main.tsx                          # Point d'entrée
├── App.tsx                           # Composant root
│
├── app/
│   ├── components/
│   │   ├── ui/                       # Shadcn composants (inchangés)
│   │   │   ├── button.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── risk/                     # Composants métier - Risques
│   │   │   ├── RiskTable.tsx         # Tableau principal
│   │   │   ├── RiskRow.tsx           # Ligne du tableau
│   │   │   ├── RiskCard.tsx          # Vue carte
│   │   │   ├── RiskDetails.tsx       # Détails d'un risque
│   │   │   └── README.md             # Docs composants
│   │   │
│   │   ├── filters/                  # Composants filtrage
│   │   │   ├── FilterPanel.tsx       # Panel de filtres
│   │   │   ├── DiseaseFilter.tsx     # Filtre maladies
│   │   │   ├── RiskLevelFilter.tsx   # Filtre niveaux
│   │   │   └── ModelFilter.tsx       # Filtre modèles
│   │   │
│   │   ├── comparison/               # Composants comparaison
│   │   │   ├── ComparisonView.tsx    # Vue comparaison
│   │   │   ├── ModelComparison.tsx   # Comparaison modèles
│   │   │   └── TrendChart.tsx        # Graphique tendance
│   │   │
│   │   ├── arcgis/                   # Intégration ArcGIS
│   │   │   ├── MapWidget.tsx         # Widget cartographique
│   │   │   ├── FeatureExporter.tsx   # Export GeoJSON
│   │   │   └── ArcGISSync.ts         # Synchronisation
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx            # Entête
│   │       ├── Sidebar.tsx           # Barre latérale
│   │       └── Footer.tsx            # Pied de page
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useRisks.ts               # Hook fetch risques
│   │   ├── useFilters.ts             # Hook gestion filtres
│   │   ├── useComparison.ts          # Hook comparaison
│   │   ├── useArcGIS.ts              # Hook ArcGIS integration
│   │   └── README.md                 # Docs hooks
│   │
│   ├── stores/                       # Zustand stores (global state)
│   │   ├── filterStore.ts            # État filtres
│   │   ├── comparisonStore.ts        # État comparaison
│   │   ├── uiStore.ts                # État UI (modals, etc)
│   │   └── README.md
│   │
│   ├── api/                          # API client
│   │   ├── client.ts                 # HTTP client (fetch wrapper)
│   │   ├── endpoints.ts              # URL endpoints
│   │   ├── risks.api.ts              # Risques endpoints
│   │   ├── weather.api.ts            # Météo endpoints
│   │   ├── models.api.ts             # Modèles endpoints
│   │   ├── arcgis.api.ts             # ArcGIS endpoints
│   │   └── README.md
│   │
│   ├── types/                        # TypeScript types
│   │   ├── risk.types.ts             # Types risques
│   │   ├── model.types.ts            # Types modèles
│   │   ├── common.types.ts           # Types communs
│   │   └── api.types.ts              # Types API
│   │
│   ├── utils/                        # Fonctions utilitaires
│   │   ├── risk.utils.ts             # Utils calcul risques
│   │   ├── format.utils.ts           # Formatage (dates, nombres)
│   │   ├── validation.utils.ts       # Schémas Zod
│   │   ├── color.utils.ts            # Couleurs/codes
│   │   ├── array.utils.ts            # Helpers array
│   │   ├── export.utils.ts           # Export CSV/GeoJSON
│   │   └── README.md
│   │
│   ├── config/                       # Configuration
│   │   ├── constants.ts              # Constantes globales
│   │   ├── env.ts                    # Variables d'env typées
│   │   ├── theme.ts                  # Configuration thème
│   │   └── models.config.ts          # Config modèles épidém
│   │
│   └── pages/                        # Page routes (si SPA)
│       ├── RisksPage.tsx
│       ├── ComparisonPage.tsx
│       └── NotFoundPage.tsx
│
├── styles/
│   ├── globals.css                   # Reset, fonts
│   ├── tailwind.css                  # Tailwind config
│   ├── theme.css                     # Variables thème
│   ├── fonts.css                     # Font faces
│   └── index.css                     # Imports
│
├── __tests__/
│   ├── unit/
│   │   ├── utils/
│   │   │   ├── risk.utils.test.ts
│   │   │   └── format.utils.test.ts
│   │   └── hooks/
│   │       ├── useRisks.test.ts
│   │       └── useFilters.test.ts
│   │
│   ├── integration/
│   │   ├── RiskTable.integration.test.tsx
│   │   └── FilterPanel.integration.test.tsx
│   │
│   └── e2e/
│       ├── risk-filtering.spec.ts
│       ├── comparison.spec.ts
│       └── arcgis-integration.spec.ts
│
├── fixtures/                         # Test data
│   ├── risks.fixtures.ts
│   ├── models.fixtures.ts
│   └── weather.fixtures.ts
│
├── __mocks__/
│   ├── api.mock.ts
│   ├── arcgis.mock.ts
│   └── msw/                         # Mock Service Worker
│       └── handlers.ts
│
└── README.md                         # Doc projet
```

---

## 4. Data Flow

### 4.1 Fetch & Caching

```
┌─────────────────────────────────────────────────────────┐
│                    React Component                       │
│                   (RiskTable.tsx)                        │
└──────────────────┬──────────────────────────────────────┘
                   │ useRisks() hook
                   ▼
┌──────────────────────────────────────────────────────────┐
│              React Query (useQuery)                       │
│  - Caching (staleTime: 5min, gcTime: 10min)             │
│  - Retry logic                                           │
│  - Background refetch                                    │
└──────────────────┬──────────────────────────────────────┘
                   │ fetch request
                   ▼
┌──────────────────────────────────────────────────────────┐
│                   API Client                             │
│        (src/app/api/risks.api.ts)                        │
│  - Request building                                      │
│  - Error handling                                        │
│  - Response validation (Zod)                             │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP GET /api/risks
                   ▼
┌──────────────────────────────────────────────────────────┐
│               Backend API Server                         │
│  - Authentication                                        │
│  - Business logic                                        │
│  - Database queries                                      │
└──────────────────────────────────────────────────────────┘
```

### 4.2 State Management

```
┌────────────────────────┐         ┌────────────────────────┐
│  Zustand Global Store  │         │   React Query Cache    │
│  (filterStore.ts)      │         │   (Server State)       │
│  - Selected filters    │         │  - Risks data          │
│  - Comparison state    │         │  - Models data         │
│  - UI state (modals)   │         │  - Weather data        │
└────────────┬───────────┘         └───────────┬────────────┘
             │                                 │
             └────────────┬────────────────────┘
                          │
             ┌────────────▼─────────────┐
             │   Component State        │
             │   (useState)             │
             │  - Local UI state       │
             │  - Form inputs          │
             │  - Sorting, pagination  │
             └─────────────────────────┘
```

---

## 5. Dépendances détaillées

### 5.1 Package.json - Dépendances à ajouter

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    
    // UI Components
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.1.8",
    "lucide-react": "^0.487.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    
    // Data Management
    "@tanstack/react-query": "^5.28.0",
    "@tanstack/react-table": "^8.17.3",
    "zustand": "^4.4.6",
    
    // Validation & Type Safety
    "zod": "^3.22.4",
    
    // Date/Time
    "date-fns": "^3.6.0",
    
    // Charts
    "recharts": "^2.10.3",
    
    // ArcGIS
    "@arcgis/core": "^4.28.0",
    
    // CSS-in-JS (si nécessaire)
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    
    // HTTP Client
    "axios": "^1.6.5",
    
    // Utilities
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.10.5",
    
    // Build
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.7",
    "tailwindcss": "^3.3.6",
    "@tailwindcss/vite": "^0.1.1",
    
    // Linting
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    
    // Formatting
    "prettier": "^3.1.0",
    
    // Testing
    "vitest": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@playwright/test": "^1.40.1",
    "msw": "^2.0.6",
    
    // Git Hooks
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    
    // PostCSS
    "postcss": "^8.4.31"
  }
}
```

### 5.2 Configuration fichiers

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // Strict mode
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    
    // Module resolution
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/app/components/*"],
      "@/hooks/*": ["./src/app/hooks/*"],
      "@/stores/*": ["./src/app/stores/*"],
      "@/api/*": ["./src/app/api/*"],
      "@/types/*": ["./src/app/types/*"],
      "@/utils/*": ["./src/app/utils/*"],
      "@/config/*": ["./src/app/config/*"]
    },
    
    // JSX
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/__tests__/**',
        'src/__mocks__/**',
        'src/types/**'
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### .eslintrc.cjs
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
};
```

#### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

---

## 6. API Contracts

### 6.1 Risques Endpoint

```typescript
// GET /api/risks
interface RisksResponse {
  data: Risk[];
  timestamp: string;
  cacheAge: number; // secondes depuis la dernière mise à jour
}

interface Risk {
  id: string;
  diseaseName: string;
  diseaseFr: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number; // 0-100
  models: ModelResult[];
  climaticFactors: {
    temperature: number; // °C
    humidity: number; // %
    rainfall: number; // mm
    leafWetness: number; // %
    windSpeed: number; // km/h
  };
  recommendations: string;
  location?: {
    latitude: number;
    longitude: number;
    region: string;
  };
  lastUpdate: string; // ISO 8601
  confidence: number; // 0-1
}

interface ModelResult {
  modelId: string;
  modelName: string;
  probability: number; // 0-100
  reliability: number; // 0-1 confidence
  calculation: {
    method: string;
    version: string;
    parameters: Record<string, unknown>;
  };
  lastUpdate: string;
}
```

### 6.2 Validation avec Zod

```typescript
// src/app/utils/validation.utils.ts
import { z } from 'zod';

export const RiskSchema = z.object({
  id: z.string().uuid(),
  diseaseName: z.string().min(1),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  probability: z.number().min(0).max(100),
  models: z.array(
    z.object({
      modelId: z.string(),
      probability: z.number().min(0).max(100),
      reliability: z.number().min(0).max(1)
    })
  ),
  lastUpdate: z.string().datetime()
});

export type Risk = z.infer<typeof RiskSchema>;

// Usage
const risks = RisksResponse.data.map(r => RiskSchema.parse(r));
```

---

## 7. Performance Optimizations

### 7.1 Code Splitting
```typescript
// Lazy load pages
const RisksPage = React.lazy(() => import('./pages/RisksPage'));
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'));

// Suspense boundary
<Suspense fallback={<LoadingSpinner />}>
  <RisksPage />
</Suspense>
```

### 7.2 Memoization
```typescript
// Composants
const RiskRow = React.memo(({ risk }: Props) => (/* ... */));

// Hooks
const memoizedRisks = useMemo(() => 
  risks.filter(r => r.riskLevel === selectedLevel),
  [risks, selectedLevel]
);

// Callbacks
const handleCompare = useCallback((id: string) => {
  // ...
}, [dependencies]);
```

### 7.3 React Query Optimization
```typescript
function useRisks() {
  return useQuery({
    queryKey: ['risks'],
    queryFn: fetchRisks,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,   // 10 min
    retry: 2,
    retryDelay: 1000
  });
}
```

---

## 8. Integration avec ArcGIS

### 8.1 Architecture d'intégration
```typescript
// src/app/components/arcgis/ArcGISSync.ts
import { useState, useEffect } from 'react';
import { useRisks } from '@/hooks/useRisks';

export function useArcGISSync() {
  const { data: risks } = useRisks();
  
  useEffect(() => {
    // Envoyer les risques à ArcGIS
    if (window.arcgis) {
      window.arcgis.sendMessage({
        type: 'risks_updated',
        data: risks
      });
    }
  }, [risks]);
}

// Export GeoJSON pour ArcGIS
export function exportRisksAsGeoJSON(risks: Risk[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: risks.map(risk => ({
      type: 'Feature',
      properties: {
        diseaseName: risk.diseaseName,
        riskLevel: risk.riskLevel,
        probability: risk.probability
      },
      geometry: {
        type: 'Point',
        coordinates: [risk.location.longitude, risk.location.latitude]
      }
    }))
  };
}
```

---

## 9. Security

### 9.1 Environment Variables
```typescript
// src/app/config/env.ts
const env = {
  API_URL: import.meta.env.VITE_API_URL,
  ARCGIS_APP_ID: import.meta.env.VITE_ARCGIS_APP_ID,
  ARCGIS_AUTH_URL: import.meta.env.VITE_ARCGIS_AUTH_URL,
};

if (!env.API_URL) {
  throw new Error('VITE_API_URL is required');
}

export default env;
```

### 9.2 CORS & Authentication
```typescript
// src/app/api/client.ts
const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  withCredentials: true, // Pour cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 10. Deployment

### 10.1 Build Production
```bash
npm run build  # Crée dist/
```

### 10.2 Hébergement Options
- **Static hosting** : Vercel, Netlify, GitHub Pages
- **Self-hosted** : Docker container, nginx reverse proxy
- **ArcGIS** : Héberger dans ArcGIS Online

### 10.3 Docker (optionnel)
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 11. Monitoring & Logging

### 11.1 Error Tracking
```typescript
// Sentry ou équivalent
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### 11.2 Structured Logging
```typescript
// src/app/utils/logger.ts
const logger = {
  info: (msg: string, data?: unknown) => {
    console.log(`[INFO] ${msg}`, data);
  },
  error: (msg: string, error?: Error) => {
    console.error(`[ERROR] ${msg}`, error);
    // Envoyer à service de monitoring
  }
};
```

---

## 12. Checklist de mise en place

- [ ] Repository Git créé
- [ ] CI/CD configuré (GitHub Actions)
- [ ] Linting + formatting en pre-commit
- [ ] Tests > 80% coverage
- [ ] Documentation README complète
- [ ] Variables d'env documentées
- [ ] Build production testé
- [ ] Deployment pipeline en place
- [ ] Monitoring/logging configuré
- [ ] Audit de sécurité fait
- [ ] Accessibilité (WCAG AA) validée
- [ ] Performance Vitals en dessous des seuils

---

## Ressources & Références

- [Vite Docs](https://vitejs.dev/)
- [React 18 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/)
- [Zustand](https://github.com/pmndrs/zustand)
- [ArcGIS API](https://developers.arcgis.com/javascript/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

