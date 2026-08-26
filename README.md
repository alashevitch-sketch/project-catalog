# EVGENIY / PROJECT SYSTEM

Публичный React-каталог проектов: dashboard, отдельные аналитические страницы, графики, статусы и автоматическая публикация на GitHub Pages.

## Что внутри

- React 19 + TypeScript + Vite;
- Motion для осмысленных переходов и hover-состояний;
- Recharts для портфельных и проектных визуализаций;
- HashRouter для надежной работы маршрутов на GitHub Pages;
- GitHub Actions для проверки, синхронизации публичных repo-сигналов и deploy;
- whitelisted JSON schema: внутренний Obsidian vault никогда не публикуется напрямую.

## Локальный запуск

```bash
pnpm install
pnpm dev
```

## Проверка

```bash
pnpm check
```

## Как добавить проект

Добавьте запись в `src/data/project-manifest.json`. Используйте только сведения, которые можно публиковать. Запрещено добавлять локальные пути, секреты, внутренние документы, персональные данные и ссылки на приватные хранилища.

Если у проекта есть публичный GitHub-репозиторий, заполните `repository.owner`, `repository.name` и `repository.url`. Во время CI скрипт `scripts/sync-projects.mjs` добавит публичные repo-метрики и статус последнего workflow run; при недоступности API сборка использует curated fallback.
