# Database Backup and Recovery

This folder contains the project database diagrams and backup/recovery scripts.

## Folder Structure

```text
database/
  backups/        generated SQL backup files
  diagrams/       conceptual ERD files
  scripts/        backup and recovery scripts
  .env.example    example database configuration
  README.md       database backup/recovery guide
```

## Backup

The script first reads database settings from:

```text
database/.env
```

Create it from:

```text
database/.env.example
```

If `database/.env` is missing, the script can still fall back to `back/.env`.

It uses these values:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME
```

Run backup:

```powershell
python database/scripts/backup_script.py
```

The backup file is saved into:

```text
database/backups/
```

Generated SQL backup files are ignored by Git.

## Automatic Backup With GitHub Actions

The project also includes an automatic backup workflow:

```text
.github/workflows/database-backup.yml
```

The workflow runs every day at 02:00 Cambodia time and can also be started manually from the GitHub Actions tab.

Before using it, add these repository secrets in GitHub:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME
```

The workflow creates a `.sql` backup with `mysqldump` and uploads it as a GitHub Actions artifact. The backup artifact is kept for 14 days. Database backup files are not committed to the repository because they can contain private user data.

## Recovery

The recovery script also reads database settings from `database/.env`.

Run the recovery script with the backup file path:

```powershell
python database/scripts/recovery_script.py database/backups/foothub_backup_YYYY-MM-DD_HH-MM-SS.sql
```

If the default restore file is already set in the script, it can also be run without passing a file path.

Do not commit real database passwords or real backup files to GitHub.
