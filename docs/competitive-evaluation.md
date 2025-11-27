# Vitest Helpers Competitive Evaluation

This document reviews `@kitiumai/vitest-helpers` against patterns seen at large product companies (e.g., Meta/Facebook, Google, Netflix, Microsoft).

## Observations

- **API Cohesion**: Big tech test wrappers expose a stable, Vitest-focused surface that bundles mocking, fixtures, and async utilities so teams do not craft bespoke helpers per repo.
- **Minimal Boilerplate**: Effective wrappers keep setup files tiny—common configs, reporters, and globals ship from a single package to minimize local glue.
- **Config Standardization**: Companies centralize config loading (coverage, reporters, globals) to enforce consistency and reduce drift between repos.
- **Fixture + Data Contracts**: Netflix-style test foundations encourage reusable fixture managers and data factories with deterministic defaults to keep e2e and component tests aligned.
- **Logging + Traceability**: Structured test logging (log-level gated) and deterministic retrieval are expected for flaky test triage and CI observability.

## Recommendations

- Keep the public surface **Vitest-first**: export consistent mock helpers (wrapping `vi.fn`), fixture managers, async waits, and HTTP mocks directly so teams can author Vitest suites with minimal imports.
- Ship opinionated **config composers** that merge base configs with project overrides (coverage, environment, reporters) so CI and local runs stay consistent—similar to Google Blaze/Bazel presets.
- Document **fixture and data factory usage** to standardize deterministic setups and reduce per-project boilerplate.
- Maintain **logging-friendly helpers** (via `@kitiumai/logger` through `@kitiumai/test-core`) to keep CI triage aligned with enterprise observability expectations.
- Provide **minimal setup templates** (single `vitest.config.ts` with presets) so repositories can adopt the wrapper without custom scaffolding.

## Implementation status

- **Vitest-first surface**: compatibility exports now cover mocks, fixtures, async helpers, HTTP mocks, and logging so Vitest suites pull from a single entry point.
- **Config composers**: `createKitiumVitestConfig` accepts opinionated presets (`local`, `ci`, `library`, `browser`) with coverage/reporters baked in, while still allowing overrides.
- **Fixture + data factories**: README documents deterministic fixture/data factory patterns with builders and factories to align projects on predictable setups.
- **Logging helpers**: logger utilities are re-exported to simplify CI-friendly traceability and log assertions.
- **Minimal templates**: README includes a one-file `vitest.config.ts` template using the new presets for drop-in adoption.
