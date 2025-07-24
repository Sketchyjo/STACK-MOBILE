# **Unified Project Structure**

```mermaid
graph TD
    subgraph Monorepo (Turborepo)
        A(apps)
        B(packages)
        C(package.json)
        D(turbo.json)
    end

    subgraph apps
        direction LR
        A1(mobile-app)
        A2(backend-api)
    end

    subgraph packages
        direction LR
        B1(contracts)
        B2(shared-types)
        B3(ui-library)
        B4(eslint-config)
    end

    A --> A1 & A2
    B --> B1 & B2 & B3 & B4
```

-----
