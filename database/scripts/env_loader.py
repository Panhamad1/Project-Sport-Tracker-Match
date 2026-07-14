import os
from pathlib import Path


def load_env_file(env_path):
    if not env_path.exists():
        return False

    with env_path.open("r", encoding="utf-8") as env_file:
        for line in env_file:
            line = line.strip()

            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            os.environ.setdefault(key, value)

    return True


def load_database_env():
    database_dir = Path(__file__).resolve().parents[1]
    project_root = database_dir.parent
    database_env_path = database_dir / ".env"
    backend_env_path = project_root / "back" / ".env"

    if load_env_file(database_env_path):
        return

    load_env_file(backend_env_path)
