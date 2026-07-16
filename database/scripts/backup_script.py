import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from env_loader import load_database_env


load_database_env()

DATABASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = DATABASE_DIR.parent

def env_value(name, default):
    return os.getenv(name) or default


DB_HOST = env_value("DB_HOST", "your-aiven-host")
DB_PORT = env_value("DB_PORT", "11930")
DB_USER = env_value("DB_USER", "avnadmin")
DB_PASSWORD = os.getenv("DB_PASS") or env_value("DB_PASSWORD", "your-password")
DB_NAME = env_value("DB_NAME", "foothub")

BACKUP_DIR = Path(os.getenv("BACKUP_DIR", DATABASE_DIR / "backups"))
if not BACKUP_DIR.is_absolute():
    BACKUP_DIR = PROJECT_ROOT / BACKUP_DIR

MYSQLDUMP_PATH = os.getenv(
    "MYSQLDUMP_PATH",
    r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
)


def resolve_command(command_path, fallback_name):
    if Path(command_path).exists():
        return command_path

    fallback = shutil.which(fallback_name)
    if fallback:
        return fallback

    raise FileNotFoundError(
        f"{fallback_name} was not found. Set MYSQLDUMP_PATH to your MySQL bin path."
    )


def validate_config():
    missing = []

    if DB_HOST == "your-aiven-host":
        missing.append("DB_HOST")
    if DB_PASSWORD == "your-password":
        missing.append("DB_PASSWORD")

    if missing:
        raise ValueError(
            "Please configure these values before running backup: "
            + ", ".join(missing)
        )


def backup_database():
    validate_config()
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    time_now = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = BACKUP_DIR / f"{DB_NAME}_backup_{time_now}.sql"
    mysqldump_command = resolve_command(MYSQLDUMP_PATH, "mysqldump")

    command = [
        mysqldump_command,
        f"--host={DB_HOST}",
        f"--port={DB_PORT}",
        f"--user={DB_USER}",
        "--ssl-mode=REQUIRED",
        "--single-transaction",
        "--routines",
        "--triggers",
        "--add-drop-database",
        "--databases",
        DB_NAME,
        f"--result-file={output_file}",
    ]

    env = os.environ.copy()
    env["MYSQL_PWD"] = DB_PASSWORD
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)

    if result.returncode == 0:
        print("Backup successful")
        print(f"File saved as: {output_file}")
        print(f"Backup time: {time_now}")
        return

    print("Backup failed")
    print(result.stderr)
    sys.exit(result.returncode)


if __name__ == "__main__":
    backup_database()
