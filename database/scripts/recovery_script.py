import os
import shutil
import subprocess
import sys
from pathlib import Path

from env_loader import load_database_env


load_database_env()

DATABASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = DATABASE_DIR.parent

DB_HOST = os.getenv("DB_HOST", "your-aiven-host")
DB_PORT = os.getenv("DB_PORT", "11930")
DB_USER = os.getenv("DB_USER", "avnadmin")
DB_PASSWORD = os.getenv("DB_PASS") or os.getenv("DB_PASSWORD", "your-password")

MYSQL_PATH = os.getenv(
    "MYSQL_PATH",
    r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
)

DEFAULT_BACKUP_FILE = Path(
    os.getenv(
        "RESTORE_FILE",
        DATABASE_DIR / "backups" / "foothub_backup_2026-07-14_17-23-47.sql",
    )
)
if not DEFAULT_BACKUP_FILE.is_absolute():
    DEFAULT_BACKUP_FILE = PROJECT_ROOT / DEFAULT_BACKUP_FILE


def resolve_command(command_path, fallback_name):
    if Path(command_path).exists():
        return command_path

    fallback = shutil.which(fallback_name)
    if fallback:
        return fallback

    raise FileNotFoundError(
        f"{fallback_name} was not found. Set MYSQL_PATH to your MySQL bin path."
    )


def validate_config(input_file):
    missing = []

    if DB_HOST == "your-aiven-host":
        missing.append("DB_HOST")
    if DB_PASSWORD == "your-password":
        missing.append("DB_PASSWORD")

    if missing:
        raise ValueError(
            "Please configure these values before running recovery: "
            + ", ".join(missing)
        )

    if not input_file.exists():
        raise FileNotFoundError(f"Backup file not found: {input_file}")


def restore_database(input_file):
    input_file = Path(input_file)
    validate_config(input_file)
    mysql_command = resolve_command(MYSQL_PATH, "mysql")

    command = [
        mysql_command,
        f"--host={DB_HOST}",
        f"--port={DB_PORT}",
        f"--user={DB_USER}",
        f"--password={DB_PASSWORD}",
        "--ssl-mode=REQUIRED",
    ]

    with input_file.open("rb") as infile:
        result = subprocess.run(command, stdin=infile, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        print(f"Restore successful from {input_file}")
        return

    print("Restore failed")
    print(result.stderr.decode("utf-8", errors="replace"))


if __name__ == "__main__":
    backup_file = sys.argv[1] if len(sys.argv) >= 2 else DEFAULT_BACKUP_FILE

    restore_database(backup_file)
